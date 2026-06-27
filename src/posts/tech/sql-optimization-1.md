---
#cover: /assets/images/cover2.jpg
icon: pen-to-square
title: A Tale of SQL Optimization
date: 2025-03-12
category:
  - Technical
tags: ["sql", "tuning"]
#sticky: true
---
# A Tale of SQL Optimization

## Background

In 2024, I was tasked with developing an attendance management system for our company. The requirements were straightforward, so the development went smoothly and the system was launched quickly. The core functionality involved processing face-scan data exported from attendance terminals across the company, applying specific rules to analyze the data, and generating attendance statistics for each department and employee, visualized through charts. The backend was straightforward, but building the frontend visualization charts was quite a challenge. As a backend developer, I wasn't very familiar with frontend development. However, after putting some effort into learning the UmiJS framework and the Ant Design component library, I managed to implement all the required features.

### The Incident

One day, I spotted a database timeout error in the system logs. Since the testing phase had been somewhat superficial without considering high-performance scenarios, this issue only surfaced six months after deployment once the accumulated attendance records reached several hundred thousand. The error occurred during a full data recalculation run.

After a brief analysis, I found that a specific SQL query took more than 20 seconds to execute, causing the database connection pool to flag a timeout and roll back the transaction. I verified that the database's own timeout settings were set to minutes, which was fine. The backend used our company's internal framework—a wrapper around Spring Cloud—with Druid as the connection pool. I recalled that the Druid connection pool supported timeout configurations, so I wondered why my config file lacked one. Upon checking the configuration classes of the framework, I discovered there was literally no property exposed for setting timeouts; configuring it did nothing. Digging into the framework source code, I realized the timeout parameter was hardcoded during initialization, and the exposed datasource parameters omitted it entirely. That was quite absurd. I searched the company's internal developer forum and found others had run into this exact issue. The framework team's suggested workaround was to rewrite the initialization class. This design seemed rather redundant. With no other choice, I decompiled the class, created a duplicate class in the matching package path within my project, copied the logic, exposed the parameters, and successfully set the connection pool timeout to 2 minutes. This temporarily mitigated the timeout crash, but to solve the root cause, I had to analyze which SQL query was running so slowly; otherwise, the issue would return as data volume grew.

### Analysis

The attendance data consists of face-scan logs exported from punch machines, linked to employees via their employee ID. While employee records are standard, their department assignments and other attributes are stored as a history list because employees transfer between departments or update attributes over time. Consequently, the attendance calculation and aggregation must associate the punch records with the employee's attributes active on the date of the punch. Following database design principles, we created tables for attendance logs, employees, employee departments, and other employee attributes. The simplified structures of the key tables are as follows:

**Attendance Table**
```sql
create table attendance_sh
(
    id            int auto_increment
        primary key,
    employee_name varchar(255) null,
    employee_id   varchar(6)   not null,
    punch_time    varchar(20)  null
);
```

**Employee Table**
```sql
create table employee_info
(
    id            int auto_increment
        primary key,
    employee_id   varchar(6)   null,
    employee_name varchar(255) null,
    constraint employee_info_pk2
        unique (employee_id)
);
```

**Employee Department Table**
```sql
create table employee_department
(
    id            int auto_increment
        primary key,
    employee_id   varchar(6)  null,
    department_id int         null,
    join_date     varchar(10) null
);
```

Let's simulate one month of attendance data by inserting some initial test records:

**Employee Data: Generate 500 employees**
```sql
INSERT INTO employee_info (employee_id, employee_name)
SELECT LPAD(FLOOR(RAND() * 1000000), 6, '0'), -- Random 6-digit employee_id
       CONCAT(
               CASE FLOOR(RAND() * 5)
                   WHEN 0 THEN 'Zhang'
                   WHEN 1 THEN 'Li'
                   WHEN 2 THEN 'Wang'
                   WHEN 3 THEN 'Liu'
                   WHEN 4 THEN 'Chen'
                   END,
               CASE FLOOR(RAND() * 10)
                   WHEN 0 THEN 'Wei'
                   WHEN 1 THEN 'Fang'
                   WHEN 2 THEN 'Jun'
                   WHEN 3 THEN 'Juan'
                   WHEN 4 THEN 'Min'
                   WHEN 5 THEN 'Jing'
                   WHEN 6 THEN 'Lei'
                   WHEN 7 THEN 'Yang'
                   WHEN 8 THEN 'Qiang'
                   WHEN 9 THEN 'Ping'
                   END,
               CASE FLOOR(RAND() * 10)
                   WHEN 0 THEN 'Ming'
                   WHEN 1 THEN 'Peng'
                   WHEN 2 THEN 'Ping'
                   WHEN 3 THEN 'Chao'
                   WHEN 4 THEN 'Li'
                   WHEN 5 THEN 'Dong'
                   WHEN 6 THEN 'Hua'
                   WHEN 7 THEN 'Juan'
                   WHEN 8 THEN 'Tao'
                   WHEN 9 THEN 'Yu'
                   END
       ) AS employee_name                     -- Random employee_name
FROM (SELECT 1 FROM information_schema.columns LIMIT 500) AS temp;
```

**Attendance Data: Generate 100,000 records dated between February and March 2024**
```sql
-- Insert 100,000 records in batch
INSERT INTO attendance_sh (employee_id, employee_name, punch_time)
SELECT ei.employee_id,   
       ei.employee_name,
       CONCAT(
                   2024, 
                   '-',
                   LPAD(FLOOR(RAND() * 2) + 2, 2, '0'), -- Month (Feb to Mar)
                   '-',
                   LPAD(FLOOR(RAND() * 28) + 1, 2, '0'), -- Date (01 to 28, avoiding invalid dates)
                   ' ',
                   LPAD(FLOOR(RAND() * 24), 2, '0'), -- Hour (00 to 23)
                   ':',
                   LPAD(FLOOR(RAND() * 60), 2, '0'), -- Minute (00 to 59)
                   ':',
                   LPAD(FLOOR(RAND() * 60), 2, '0') -- Second (00 to 59)
       ) AS punch_time
FROM (SELECT employee_id, employee_name FROM employee_info) AS ei 
          CROSS JOIN
          (SELECT 1 FROM information_schema.columns LIMIT 200) AS temp 
ORDER BY RAND() -- Shuffle order
LIMIT 100000;
```

**Employee Department Table: Assume each employee joined a department in 2023, and randomly transferred departments once in 2024**
```sql
-- Insert 2 records per employee to simulate department transfers
INSERT INTO employee_department (employee_id, department_id, join_date)
SELECT ei.employee_id,                                         
       FLOOR(RAND() * 10) + 1,                                 
       DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 365) DAY) 
FROM (SELECT employee_id FROM employee_info LIMIT 1000) AS ei; 
```

The performance bottleneck occurred in an analysis feature requiring the output of the corresponding department for every single attendance record. The requirement can be simplified as: query the attendance records and append each employee's department ID at the time of the punch. Implementing this query is straightforward—retrieve the active department from the employee department history table, leading to our first approach.

#### Base Approach
For each attendance record, retrieve the employee's active department ID from the department history table where the department join date is less than or equal to the punch time, selecting the most recent record.

```sql
create temporary table v1 as
SELECT
    ash.id,
    ash.employee_name,
    ash.employee_id,
    ash.punch_time,
    (
        SELECT
            ed.department_id
        FROM
            employee_department ed
        WHERE
                ed.employee_id = ash.employee_id
          AND ed.join_date <= SUBSTR(ash.punch_time, 1, 10)
        ORDER BY
            ed.join_date DESC
        LIMIT 1
    ) AS department_id
FROM
    attendance_sh ash;
```

This approach is correct, but its performance is bound to be poor. Because it relies on a correlated subquery instead of a join, a subquery must run for every single record in the attendance table, leaving very little room for the MySQL optimizer to perform optimizations. However, one aspect we can optimize for page views is using a pagination plugin to fetch pages on-demand rather than retrieving the entire result set before paging. When running a single page query in IntelliJ IDEA, it completed in a few hundred milliseconds since IDEA automatically appends pagination. Thus, this query is perfectly fine for basic paginated dashboard views.

```text
500 rows retrieved starting from 1 in 143 ms (execution: 76 ms, fetching: 67 ms)
```

However, if we populate a temporary table to output the full dataset, it is terribly slow:

```text
100,000 rows affected in 1 m 44 s 372 ms
```

It took over a minute to generate the entire dataset.

#### Query Optimization

Could we solve this with a JOIN query? It's not that simple. I asked an AI assistant, and it quickly came up with this proposal:

```sql
SELECT
    ash.employee_name,
    ash.employee_id,
    ash.punch_time,
    ed.department_id
FROM
    attendance_sh ash
        LEFT JOIN LATERAL (
        SELECT
            department_id
        FROM
            employee_department ed_inner -- Use a different alias ed_inner
        WHERE
                ed_inner.employee_id = ash.employee_id
          AND ed_inner.join_date <= SUBSTR(ash.punch_time, 1, 10)
        ORDER BY
            ed_inner.join_date DESC
        LIMIT 1
        ) ed ON 1=1;
```

Initially, the AI referenced the outer attendance table `ash` inside the subquery under `LEFT JOIN`, which obviously threw an error because `ash` is not in the scope of that subquery. After I pointed out the error, it suggested using the **`LATERAL`** keyword, which was new to me. However, testing it showed no performance improvement compared to the original correlated subquery. This makes sense: although it syntactically joins the tables, it still relies on details from the attendance table for every single record, forcing the database to build a custom relation per row. The underlying execution pattern hadn't changed, so introducing advanced keywords didn't solve the core issue.

So I shifted my approach: what if we pre-populate the records using each employee's latest department assignment, and then clean up any exceptions later? This should work because most employees rarely switch departments. Even if they do transfer, it might not have occurred within the specific attendance window under calculation. This led to **Approach V2**: use window functions to partition and sort the department history, selecting only the latest record (`rn = 1`). We specify a maximum cut-off date (corresponding to the `max(date)` of our attendance window, e.g., `'2024-04-01'`) in the `WHERE` clause. This allows the subquery to filter records before sorting, which filters out department transfers that occurred after the attendance period. These future transfers are irrelevant and would otherwise occupy the `rn = 1` slot, preventing us from matching the active department during the target period.

```sql
create temporary table v2 as
SELECT
    ash.id,
    ash.employee_name,
    ash.employee_id,
    ash.punch_time,
    ed_ranked.department_id
FROM
    attendance_sh ash
        LEFT JOIN (
        SELECT
            ed.*,
            ROW_NUMBER() OVER (PARTITION BY ed.employee_id ORDER BY ed.join_date DESC) as rn
        FROM
            employee_department ed
        where ed.join_date < '2024-04-01' -- Pass target date
    ) ed_ranked ON ash.employee_id = ed_ranked.employee_id
        AND ed_ranked.join_date <= SUBSTR(ash.punch_time, 1, 10)
        AND ed_ranked.rn = 1;
```

It ran extremely fast:

```text
100,000 rows affected in 617 ms
```

However, some records will miss the department assignment. If an employee's latest department assignment (`rn = 1`) has a `join_date` that is strictly after the punch time, the join condition `ed_ranked.join_date <= SUBSTR(ash.punch_time, 1, 10)` fails. Since it is a `LEFT JOIN`, the `department_id` for those rows ends up as `NULL`.

How many records missed the join?

```sql
select count(1) from v2 where department_id is null; -- 8,888
```

Out of 100,000 records, exactly 8,888 were missed. This is actually a very good match rate. Since the simulated attendance logs are concentrated in a two-month window while department transfers are distributed across the entire year, the latest assignment (`rn = 1`) fits the criteria for most employees. Only a small group transferred departments in early 2024, leaving some of their earlier logs unmatched.

To fill in the missing 8,888 records, we run an update query. Since the unmatched volume is small, using a correlated subquery update is perfectly acceptable:

```sql
update v2
set v2.department_id = (select department_id
                        from employee_department ed
                        where v2.employee_id = ed.employee_id
                          and ed.join_date < SUBSTR(v2.punch_time, 1, 10)
                        limit 1)
where v2.department_id is null;
```

The update completed quickly:

```text
8,888 rows affected in 2 s 471 ms
```

Now, the temporary table `v2` contains identical results to `v1`. By using this "optimistic pre-matching + cleanup update" strategy, the total execution time fell to around 3 seconds—a massive improvement over the 1 minute and 44 seconds required by the base approach. Given that attendance logs are archived annually, the system will only need to process at most one year of data at a time, making a 3-second runtime fully acceptable to keep this system running smoothly.

#### Index Optimization

Was it necessary to add indexes? Not really. Indexes can only optimize join operations. The `employee_id` in the attendance table was already indexed due to other frequent queries. Even if we added more indexes on the columns used in `ORDER BY` or `JOIN`, they wouldn't address the main bottleneck: the correlated subqueries running once per record. Since the join portion of the optimized query is already extremely fast, any performance gain from further indexing would be negligible and not worth the overhead.

### Reflective Summary

There are countless database optimization strategies in textbooks, but resolving real-world bottlenecks requires looking at the data's specific traits and the execution plan. Often, it takes trial and error rather than a rigid pattern. While this was a minor performance issue, the system itself was quite simple, making this one of the few memorable technical challenges I faced during its development. My general approach to debugging and optimization is to get a working implementation first, and then optimize. A rough start is always better than standing still. Over time, I might look back and find this solution trivial or realize that there are more standard ways to do it. But that's alright; every learning path has to start somewhere, and nobody writes a perfect architecture on their first attempt. I'm writing this down as a milestone in my software engineering journey.
