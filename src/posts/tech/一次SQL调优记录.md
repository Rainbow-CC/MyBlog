---
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2025-03-12
category:
  - SQL
  - tech
tags: []
star: true
sticky: true
---

## 背景介绍

24年，接到公司的需求，开发一套考勤管理系统。考勤系统功能简单，开发起来也比较顺手，很快就上线了。需求比较简单，就是处理全公司考勤机输出的刷脸数据，根据指定的规则进行处理和分析，得到各部门和员工的考勤统计信息，并以图表的形式展示。后端没什么好说的，就是前端的展示图表比较麻烦。作为一个后端开发，前端着实不怎么熟，使用UMI框架+ ant-design 组件库，废了一些功夫，也算把所有功能都实现了。

### 起因

某次系统日志中检查到报错信息：数据库超时。因为测试的时候比较水，并没有考虑到性能的问题，系统上线半年后，导入的考勤数据达到几十万，在某个全量数据重算的功能中，第一次看到了这个问题。

进行了简单的分析后，发现是某个SQL执行时间超过了20秒，数据库连接池判定超时，回滚了事务。我查看了数据库超时设置，是分钟级别的，没有问题。后端所用的开发框架是公司给定的，一个基于SpringCloud封装的框架，连接池采用的Druid。我印象中Druid连接池有超时设置的，为什么我的配置文件中没有注意呢？打开配置文件对应的配置类，发现的确没有超时时间的设置项，配置了也没用。点开框架代码才发现，竟然是在初始化的时候给写死了，暴露出来的Datasource参数就没这一项，真是离谱。去公司论坛上搜了下，果然有人问了这个问题，框架组给的解决方案就是重写初始化类。这设计，多少有点多此一举了。没办法，反编译源码后，根据包路径新建了一个相同类，拷贝代码并修改，把连接参数暴露出来，给连接池超时时间设置为2分钟，暂时解决了这个问题。但是想要根治，还得分析哪个SQL跑的这么慢，不然数据量增加之后，或许还会出问题。

### 分析

考勤数据是打卡机的输出，包含各个机器的刷脸记录，有员工号来关联员工。员工的信息平平无奇，但员工的部门信息，以及其他某些信息，是一个列表，因为员工的部门和其他某些属性，是存在变动的，而考勤的统计汇总分析，要关联到考勤数据日期对应的员工属性。根据数据库设计规则，建立考勤信息表，员工表，员工部门表， 员工XXX表等。关键表的简化表结构如下：

**考勤表**
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

**员工表**
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

**员工部门表**
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

模拟一个月的考勤数据吧，插入一些初始化的测试数据：
员工数据：生成500员工
```sql
INSERT INTO employee_info (employee_id, employee_name)
SELECT LPAD(FLOOR(RAND() * 1000000), 6, '0'), -- 随机生成6位数字的 employee_id
       CONCAT(
               CASE FLOOR(RAND() * 5)
                   WHEN 0 THEN '张'
                   WHEN 1 THEN '李'
                   WHEN 2 THEN '王'
                   WHEN 3 THEN '刘'
                   WHEN 4 THEN '陈'
                   END,
               CASE FLOOR(RAND() * 10)
                   WHEN 0 THEN '伟'
                   WHEN 1 THEN '芳'
                   WHEN 2 THEN '军'
                   WHEN 3 THEN '娟'
                   WHEN 4 THEN '敏'
                   WHEN 5 THEN '静'
                   WHEN 6 THEN '磊'
                   WHEN 7 THEN '洋'
                   WHEN 8 THEN '强'
                   WHEN 9 THEN '萍'
                   END,
               CASE FLOOR(RAND() * 10)
                   WHEN 0 THEN '明'
                   WHEN 1 THEN '鹏'
                   WHEN 2 THEN '平'
                   WHEN 3 THEN '超'
                   WHEN 4 THEN '丽'
                   WHEN 5 THEN '东'
                   WHEN 6 THEN '华'
                   WHEN 7 THEN '娟'
                   WHEN 8 THEN '涛'
                   WHEN 9 THEN '宇'
                   END
       ) AS employee_name                     -- 随机生成 employee_name
FROM (SELECT 1 FROM information_schema.columns LIMIT 500) AS temp;

```
考勤数据，生成10万条，日期为2024年2月到3月。
```sql
-- 批量插入 100000 条数据
INSERT INTO attendance_sh (employee_id, employee_name, punch_time)
SELECT ei.employee_id,   
       ei.employee_name,
       CONCAT(
                   2024, 

                   '-',
                   LPAD(FLOOR(RAND() * 2) + 2, 2, '0'), -- 随机生成月份（2月 到 3月）

                   '-',
                   LPAD(FLOOR(RAND() * 28) + 1, 2, '0'), -- 随机生成日期（01 到 28，避免生成无效日期）

                   ' ',
                   LPAD(FLOOR(RAND() * 24), 2, '0'), -- 随机生成小时（00 到 23）

                   ':',
                   LPAD(FLOOR(RAND() * 60), 2, '0'), -- 随机生成分钟（00 到 59）

                   ':',
                   LPAD(FLOOR(RAND() * 60), 2, '0') -- 随机生成秒数（00 到 59）
       ) AS punch_time
FROM (SELECT employee_id, employee_name FROM employee_info) AS ei 
         CROSS JOIN
         (SELECT 1 FROM information_schema.columns LIMIT 200) AS temp 
ORDER BY RAND() -- 随机打乱顺序
LIMIT 100000;
```
员工部门表，假设每个员工23年进入部门，24年随机换一次部门
```sql
-- 每个员工1数据，插入2次；模拟每个员工换了次部门, 注意修改时间
INSERT INTO employee_department (employee_id, department_id, join_date)
SELECT ei.employee_id,                                         
       FLOOR(RAND() * 10) + 1,                                 
       DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 365) DAY) 
FROM (SELECT employee_id FROM employee_info LIMIT 1000) AS ei; 
```

性能出现问题的点，在于某个分析需求中，需要输出每一条考勤记录对应的员工的部门信息，需求就简化为：查询考勤记录，并把员工的部门id拼上。要实现这个查询，非常简单，直接从员工部门表获取即可，于是有方案一：基础方案。

#### 基础方案
在查询的部门字段，直接去部门表查即可，去找部门表里对应员工的部门信息，并且加入部门的日期小于打卡日期并且最近的那一条记录。
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
这个方案，肯定是对的，但性能一定很糟糕，因为采用了相关子查询，没有联表，考勤表中的每一条记录都要进行一次子查询，MYSQL优化器也很难有优化的空间。但至少有一点是可以优化的，即页面查看时，我们对查询直接采用分页插件直接分页即可，无需担心MySQL获取全量的结果集再分页。在IDEA里执行了一次查询，果然速度很快，几百毫秒，因为IDEA里自带分页。那么这个方案应对页面查询完全没有问题。
```
500 rows retrieved starting from 1 in 143 ms (execution: 76 ms, fetching: 67 ms)
```
但是我们生成临时表，让它输出全量数据，那肯定快不了了：
```
100,000 rows affected in 1 m 44 s 372 ms
```
足足一分钟多才生成。

#### 方案优化

能不能做联表查询呢？不太好做。问了下AI，它很快给了一个回答：
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
            employee_department ed_inner --  使用不同的别名 ed_inner
        WHERE
                ed_inner.employee_id = ash.employee_id
          AND ed_inner.join_date <= SUBSTR(ash.punch_time, 1, 10)
        ORDER BY
            ed_inner.join_date DESC
        LIMIT 1
        ) ed ON 1=1;
```
一开始它在left join 的子查询里引用了考勤表ash, 当然报错了，因为ash在外部，不在子查询的SELECT作用域中，肯定是不可见的。我指出了这个错误后，它给了个高级的东西 **LATERAL**，我的确没见过。但测试了一下，完全不管用，效果跟相关子查询没什么区别。想想也是，虽然联表，但还是依赖了考勤表里的信息，难免要根据考勤表每一条记录的数据特征去形成关联的表，思路上没什么变化，不可能说换几个高级的关键字就好起来了吧~

于是我换了种思路，能不能先用员工最新的部门信息给填一波，不符合要求的再进行处理呢？应该是可行的，毕竟大部分员工其实没换过部门，~~（公司也不会给这个机会折腾吧，不如裁掉）~~ 就算换了部门，计算考勤信息的这个区间也未必换过。那么有了方案v2：通过窗口函数进行分组排序，只要join_date rank1 数据。这里传入一个最大日期，也即本次分析时对应的attendance_sh中的max(date)。增加这个筛选条件`where ed.join_date < '2024-04-01'`, 那么子查询会先where筛选，再排序。这样做的好处在于，过滤掉考勤最后日期之后转部门的记录，因为这些数据显然没用，并且会在分组排序时占用rank1，使满足条件的记录“不够新”而无法匹配。

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
        where ed.join_date < '2024-04-01' -- 日期，传入
    ) ed_ranked ON ash.employee_id = ed_ranked.employee_id
        AND ed_ranked.join_date <= SUBSTR(ash.punch_time, 1, 10)
        AND ed_ranked.rn = 1;
```
运行非常快：
```
100,000 rows affected in 617 ms
```
但是这个结果会漏掉数据，如果rank 1的数据，不满足`ed_ranked.join_date <= SUBSTR(ash.punch_time, 1, 10)`, 那么这个join就关联不到了，因为是left join，department_id 就是null， 但数据还在。

漏了多少数据呢？
```sql
select count(1) from v2 where department_id is null; -- 8888
```
数字挺吉利，10w条数据漏了8888条。这个比例已经很不错了。因为生成的随机数据中，考勤日期集中在两个月，而部门切换日期分散在2024一整年，所以大部分人其实rank1 数据是符合要求的，少部分在1月-2月期间切换了部门，导致部分考勤数据匹配不到。

匹配不到的数据，我们执行一次更新查询，因数据较少，还是采用相关子查询更新即可：
```sql
update v2
set v2.department_id = (select department_id
                        from employee_department ed
                        where v2.employee_id = ed.employee_id
                          and ed.join_date < SUBSTR(v2.punch_time, 1, 10)
                        limit 1)
where v2.department_id is null;
-- 8,888 rows affected in 2 s 471 ms
```
更新的还是很快的，2s多。现在v2表已经和v1等同了。采用先行匹配+更新的方式生成，总耗时3s，与基础方案1min多相比，时间大大降低。因为设计中对考勤数据会按年度归档，因此考虑最多处理一年的数据，因此这个耗时可以接受，此方案可以支撑这个小系统平稳运行很久。

#### 索引优化

加索引有无必要呢？其实必要性不大，因为索引只能优化联表的性能。考勤表的employee_id，因为查询较多，本就是有索引的。如果增加索引，只能在ORDER BY 和join 关键字所在的列设置索引。但这个查询，耗时的瓶颈在于相关子查询，这个是每一条记录都执行子查询导致的，索引无法改变这个行为。而联表的环节，耗时极低，那么优化的上限，一定低于联表本身的耗时，因此无性价比。

### 总结思考

数据库的优化方法有很多，八股文也背了很多，但真遇到之后，还是要认真分析原理，了解数据特征。很多时候还是要有探索问题的思路，没有固定范式。这次的问题其实是个很小的问题，但可惜系统过于简单，这是我为数不多留下点印象的技术问题，就整理在这里吧。我对于问题的处理方法，通常是先尝试做，再优化。一个糟糕的开始总好过原地踏步。也许过一些时间之后，我会发现我的解法实际上很一般，或者正确的处理方法本就是程序员必备的技能。但没关系，事情总有一个开始，没人会一动手就抬出完美方案的。故整理本次故事，作为我人生的一段经历。







