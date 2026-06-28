---
title: How to Work with Code Agents
icon: robot
date: 2026-06-28
category:
  - Technical
tags:
  - AI
  - Productivity
  - Workflow
---

# How to Work with Code Agents

### 1. Set Up Your AGENT.MD
* Run `back/init` to generate the file, which acts as a technical "onboarding document" for the AI.
* Define your tech stack (e.g., "we use functional components with hooks"), directory structure, and specific dev commands.
* Keep it lean (100–200 lines) to ensure a high signal-to-noise ratio; overwhelming the model with too much context can lead to mistakes.

### 2. Use Plan Mode Before Writing a Line of Code
* Always trigger "plan mode" to have Claude describe which files it will change and what the logic flow will be.
* This step allows you to push back or edit the architecture before tokens are spent on potentially wrong code.
* Skipping this often leads to code that "works" but is implemented in the wrong place or solves the wrong problem.

### 3. /CLEAR Between Tasks
* Use the `back/clear` command habitually after finishing a specific task.
* Performance degrades as the context window fills up, causing the model to lose track of constraints or make "weird decisions".
* Fresh sessions ensure that stale history doesn't bleed into and confuse new work.

### 4. Build Slash Commands for Your Repeat Workflows
* Create custom commands in the `.clau_commands` folder for any task performed more than once a week.
* Examples include `PR summary` for generating descriptions or commands for unit test generation.
* This saves time by avoiding the need to rewrite complex prompts manually every time.

### 5. Wire Up a Validation Loop
* Set up automated "hooks" that trigger your build system, test runner, and type checker every time Claude saves a file.
* This creates a self-correcting loop where Claude sees failure logs immediately and fixes its own bugs without human intervention.
* Setting this up (approx. 20 minutes) ensures you return to a green CI rather than a pile of errors.

### 6. Use Parallel Sessions and Sub-Agents for Isolated Work
* **Parallel Sessions**: Run Claude in multiple IDE panels or use **Git Worktrees** to work on a bug fix and a new feature at the same time in separate directories.
* **Sub-Agents**: Spin up specialized agents from within your main session to handle isolated tasks like security reviews or database queries.
* This prevents the reasoning for one complex task from "bleeding" into and confusing another.

### 7. Encode Workflows as Skills
* "Skills" are markdown playbooks that travel with your codebase, defining multi-step logic for complex operations like refactors or releases.
* While slash commands are for quick triggers, Skills represent institutional knowledge that teammates can also utilize.

### 8. Always Follow Plan-Execute-Review
* **Plan**: Establish the logic and constraints first.
* **Execute**: Break the work into small, specific steps to produce tighter, more reviewable diffs.
* **Review**: Carefully verify the changes before merging into the main branch.