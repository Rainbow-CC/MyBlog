<script setup lang="ts">
import { withBase } from "vuepress/client";

const projects = [
    ["Web application", "Cook Book", "An online cookbook for organising recipes, cooking steps, and personal notes.", "/portfolio/cook-book.html"],
    ["Technical presentation", "React Flow Presentation", "An experiment in AI-generated technical visuals with a consistent visual system.", "/portfolio/react-flow-presentation.html"],
    ["Presentation", "Annual Report", "A precise, editable annual-report deck created with AI and Slidev.", "/portfolio/annual-report-jiang.html"],
];

const writing = [
    ["Engineering note", "2026.06", "How to Work with Code Agents", "A practical workflow for giving coding agents context, guardrails, and feedback.", "/posts/chat/how%20to%20work%20with%20code%20agents.html"],
    ["Database", "2024.01", "Common SQL Tuning Methods", "The indexing and query-design decisions that have the biggest impact on database performance.", "/posts/tech/sql-optimization-methods.html"],
    ["Architecture", "2024.01", "Client–Server Communication", "A concise guide to the trade-offs behind common communication patterns.", "/posts/tech/client-server-communication.html"],
];

const experience = [
    {
        period: "Jun 2023 — Present",
        company: "China Industrial International Trust Limited",
        role: "Senior Software Engineer",
        summary: "Backend development and optimisation for family-trust transaction, onboarding, settlement, approval-workflow, and reporting systems. Also built internal management products and LLM-based tools.",
        skills: ["Java", "Spring Boot", "Oracle", "React", "LLM workflows"],
    },
    {
        period: "Apr 2021 — May 2023",
        company: "East Money Securities Co., Ltd.",
        role: "Backend Development Engineer",
        summary: "Developed proprietary-trading registration and clearing systems, including counterparty simulation, security-pool processing, configurable file handling, and end-of-day clearing automation.",
        skills: ["Java", "Oracle", "Batch processing", "Clearing systems"],
    },
];

const education = [
    {
        period: "Sep 2018 — Mar 2021",
        school: "Shanghai Jiao Tong University",
        degree: "Master of Engineering, Electrical Engineering",
    },
    {
        period: "Sep 2014 — Jun 2018",
        school: "Shandong University",
        degree: "Bachelor of Engineering, Electrical Engineering",
    },
];
</script>

<template>
    <div class="home">
        <header class="nav"><a class="mark" :href="withBase('/')">R.</a>
            <nav><a href="#work">Work</a><a href="#writing">Writing</a><a href="#experience">Experience</a><a
                    :href="withBase('/intro.html')">About</a></nav><a class="contact"
                href="mailto:o77088826@gmail.com">Get in touch</a>
        </header>
        <main>
            <section class="hero">
                <p class="eyebrow">Backend developer</p>
                <h1>Building thoughtful systems,<br>documenting what I learn.</h1>
                <p class="lede">A personal archive of backend engineering, technical experiments, and the projects made
                    along the way.</p>
                <div class="actions"><a class="button primary" href="#writing">Read the notes ↓</a><a class="button"
                        :href="withBase('/portfolio/')">Selected work ↗</a></div>
            </section>
            <section id="work" class="section">
                <div class="heading">
                    <p class="eyebrow">01 / Selected work</p>
                    <h2>Projects with a point of view.</h2><a :href="withBase('/portfolio/')">View all work ↗</a>
                </div>
                <div class="project-grid"><a v-for="([type, title, description, href], i) in projects" :key="title"
                        class="project" :class="{ offset: i === 1 }" :href="withBase(href)">
                        <div class="art"><span>0{{ i + 1 }}</span></div>
                        <p>{{ type }}</p>
                        <h3>{{ title }}</h3><span>{{ description }}</span><b>Explore ↗</b>
                    </a></div>
            </section>
            <section id="writing" class="section writing">
                <div class="heading">
                    <p class="eyebrow">02 / Recent writing</p>
                    <h2>Notes from the work.</h2><a :href="withBase('/posts/')">Browse all articles ↗</a>
                </div>
                <div class="articles"><a v-for="[type, date, title, description, href] in writing" :key="title"
                        class="article" :href="withBase(href)">
                        <div>
                            <p>{{ type }}</p><time>{{ date }}</time>
                        </div>
                        <h3>{{ title }}</h3><span>{{ description }}</span><b>↗</b>
                    </a></div>
            </section>
            <section id="experience" class="section experience">
                <div class="heading">
                    <p class="eyebrow">03 / Experience</p>
                    <h2>Building systems<br>that need to last.</h2><span>Financial systems · Backend engineering</span>
                </div>
                <ol class="experience-list">
                    <li v-for="item in experience" :key="item.company">
                        <p class="period">{{ item.period }}</p>
                        <div>
                            <h3>{{ item.company }}</h3>
                            <p class="role">{{ item.role }}</p>
                            <p class="experience-summary">{{ item.summary }}</p>
                            <ul><li v-for="skill in item.skills" :key="skill">{{ skill }}</li></ul>
                        </div>
                    </li>
                    <li v-for="item in education" :key="item.school" class="education-item">
                        <p class="period">{{ item.period }}</p>
                        <div>
                            <h3>{{ item.school }}</h3>
                            <p class="role">{{ item.degree }}</p>
                            <p class="experience-summary">Education</p>
                        </div>
                    </li>
                </ol>
            </section>
            <section class="closing">
                <p class="eyebrow">04 / Keep in touch</p>
                <h2>Have a good problem<br>to solve?</h2><a href="mailto:o77088826@gmail.com">o77088826@gmail.com ↗</a>
            </section>
        </main>
        <footer><span>© {{ new Date().getFullYear() }} Rainbow</span><a href="https://github.com/Rainbow-CC"
                target="_blank" rel="noopener noreferrer">GitHub ↗</a></footer>
    </div>
</template>

<style scoped>
.home {
    --bg: #090909;
    --ink: #f5f5f5;
    --text: #c7c7c7;
    --muted: #929292;
    --line: #303030;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.nav,
.hero,
.section,
.closing,
footer {
    width: min(1120px, calc(100% - 40px));
    margin: auto;
}

.nav {
    height: 78px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--line);
}

.mark,
h1,
h2,
h3 {
    font-family: Georgia, serif;
    color: var(--ink);
}

.mark {
    font-size: 1.8rem;
    font-weight: 700;
    text-decoration: none;
}

.nav nav {
    display: flex;
    gap: 2rem;
    margin-left: auto;
    margin-right: 2rem;
}

.nav a,
.heading>a,
footer {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-decoration: none;
    text-transform: uppercase;
}

.nav nav a {
    color: var(--muted);
}

.contact {
    padding: .68rem .9rem;
    border: 1px solid var(--ink);
    color: var(--ink);
}

.hero {
    min-height: min(720px, calc(100vh - 78px));
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5rem 0;
}

.eyebrow {
    margin: 0;
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
}

h1 {
    max-width: 950px;
    margin: 1.35rem 0 0;
    font-size: clamp(2.2rem, 7vw, 5.2rem);
    letter-spacing: -.065em;
    line-height: .98;
}

.lede {
    max-width: 610px;
    margin: 2rem 0 0;
    font-size: 1.18rem;
    line-height: 1.65;
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    margin-top: 2.5rem;
}

.button {
    padding: .9rem 1rem;
    border: 1px solid var(--ink);
    color: var(--ink);
    font-size: .77rem;
    font-weight: 700;
    letter-spacing: .06em;
    text-decoration: none;
    text-transform: uppercase;
}

.primary {
    background: var(--ink);
    color: var(--bg);
}

.button:hover,
.contact:hover {
    background: #ededed;
    border-color: #ededed;
    color: #111;
}

.location {
    margin-top: 4rem;
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .72rem;
}

.section {
    padding: 7.5rem 0;
    border-top: 1px solid var(--line);
}

.heading {
    display: grid;
    grid-template-columns: 1fr 2.2fr 1fr;
    gap: 1.5rem;
    align-items: baseline;
}

.heading h2,
.closing h2 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.6rem);
    letter-spacing: -.045em;
    line-height: 1;
}

.heading>a {
    justify-self: end;
    color: var(--ink);
}

.heading>span {
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .7rem;
    line-height: 1.6;
    text-align: right;
    text-transform: uppercase;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
    margin-top: 4.5rem;
}

.project {
    display: flex;
    flex-direction: column;
    color: var(--text);
    text-decoration: none;
}

.offset {
    margin-top: 4rem;
}

.art {
    position: relative;
    height: 235px;
    overflow: hidden;
    border: 1px solid var(--line);
    background: linear-gradient(135deg, #151515, #292929 55%, #454545);
    transition: transform .2s;
}

.project:nth-child(2) .art {
    background: linear-gradient(135deg, #e6e6e6, #777 55%, #222);
}

.project:nth-child(3) .art {
    background: linear-gradient(135deg, #3a3a3a, #111 50%, #6b6b6b);
}

.art::before {
    position: absolute;
    inset: 17% 18%;
    border: 1px solid rgb(255 255 255 / .38);
    content: "";
    transform: rotate(-7deg);
}

.art span {
    position: absolute;
    right: 1rem;
    bottom: .8rem;
    color: var(--ink);
    font-family: Georgia, serif;
    font-size: 3.6rem;
    opacity: .55;
}

.project p,
.article p {
    margin: 1.3rem 0 .55rem;
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .67rem;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
}

.project h3,
.article h3 {
    margin: 0;
    font-size: 1.55rem;
    letter-spacing: -.035em;
}

.project>span,
.article>span {
    margin-top: .8rem;
    font-size: .91rem;
    line-height: 1.65;
}

.project b {
    margin-top: 1.25rem;
    color: var(--ink);
    font-family: ui-monospace, monospace;
    font-size: .69rem;
    letter-spacing: .08em;
    text-transform: uppercase;
}

.project:hover .art {
    transform: translateY(-4px);
}

.writing {
    padding-bottom: 0;
}

.articles {
    margin-top: 4.5rem;
}

.article {
    display: grid;
    grid-template-columns: 1fr 2.15fr 1.6fr auto;
    gap: 1.4rem;
    align-items: center;
    padding: 1.7rem 0;
    border-top: 1px solid var(--line);
    color: var(--text);
    text-decoration: none;
}

.article:last-child {
    border-bottom: 1px solid var(--line);
}

.article p {
    margin: 0;
}

.article time {
    display: block;
    margin-top: .4rem;
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .7rem;
}

.article>b {
    color: var(--ink);
    font-size: 1.3rem;
}

.article:hover h3,
.heading>a:hover,
.closing a:hover {
    color: #fff;
}

.experience-list {
    padding: 0;
    margin: 4.5rem 0 0;
    list-style: none;
}

.experience-list>li {
    display: grid;
    grid-template-columns: 1fr 3.2fr;
    gap: 1.5rem;
    padding: 2.1rem 0;
    border-top: 1px solid var(--line);
}

.experience-list>li:last-child {
    border-bottom: 1px solid var(--line);
}

.period,
.role {
    margin: 0;
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .72rem;
    letter-spacing: .05em;
    text-transform: uppercase;
}

.experience-list h3 {
    margin: 0;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    letter-spacing: -.035em;
}

.role {
    margin-top: .5rem;
}

.experience-summary {
    max-width: 710px;
    margin: 1.25rem 0 1.1rem;
    line-height: 1.7;
}

.experience-list ul {
    display: flex;
    flex-wrap: wrap;
    gap: .45rem;
    padding: 0;
    margin: 0;
    list-style: none;
}

.experience-list ul li {
    padding: .35rem .55rem;
    border: 1px solid var(--line);
    color: var(--muted);
    font-family: ui-monospace, monospace;
    font-size: .67rem;
}


.closing {
    padding: 9rem 0;
}

.closing h2 {
    margin: 1.4rem 0 2.3rem;
    font-size: clamp(2.7rem, 6vw, 5.3rem);
    letter-spacing: -.06em;
}

.closing a {
    color: var(--ink);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    text-decoration: none;
}

footer {
    display: flex;
    justify-content: space-between;
    padding: 1.8rem 0;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-family: ui-monospace, monospace;
}

footer a {
    color: var(--ink);
    text-decoration: none;
}

@media(max-width:700px) {
    .nav {
        height: 64px;
    }

    .nav nav {
        display: none;
    }

    .contact {
        padding: .55rem .65rem;
        font-size: .63rem;
    }

    .hero {
        min-height: 620px;
        padding: 4.5rem 0;
    }

    h1 {
        font-size: clamp(2.8rem, 14vw, 4.4rem);
    }

    .section {
        padding: 5.2rem 0;
    }

    .heading {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .heading>a {
        justify-self: start;
    }

    .heading>span {
        text-align: left;
    }

    .project-grid {
        grid-template-columns: 1fr;
        margin-top: 3rem;
    }

    .offset {
        margin-top: 0;
    }

    .art {
        height: 205px;
    }

    .article {
        grid-template-columns: 1fr auto;
        gap: .8rem;
    }

    .article h3,
    .article>span {
        grid-column: 1;
    }

    .article>span {
        margin-top: 0;
    }

    .article>b {
        grid-column: 2;
        grid-row: 1 / span 3;
    }

    .experience-list {
        margin-top: 3rem;
    }

    .experience-list>li {
        grid-template-columns: 1fr;
        gap: 1rem;
    }


    .closing {
        padding: 6.5rem 0;
    }
}
</style>
