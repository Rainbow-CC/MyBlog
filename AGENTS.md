# Repository Guidelines

## Project Structure & Module Organization

This repository is a VuePress Theme Hope blog. The documentation source lives in `src/`, with the home page at `src/README.md` and article content under `src/posts/`. VuePress configuration is in `src/.vuepress/`: use `config.ts` for site-level settings, `theme.ts` for theme options, and `navbar.ts` / `sidebar.ts` for navigation. Custom Vue components belong in `src/.vuepress/components/`, shared styles in `src/.vuepress/styles/`, and static assets in `src/.vuepress/public/`.

## Build, Test, and Development Commands

Use npm, because the lockfile is `package-lock.json`.

- `npm install`: install dependencies.
- `npm run docs:dev`: start the local VuePress development server.
- `npm run docs:clean-dev`: start dev mode after clearing VuePress cache; use this when navigation, theme, or component changes behave oddly.
- `npm run docs:build`: generate the production site and catch broken config, Markdown, or component imports.
- `npm run docs:update-package`: run the VuePress Theme Hope package updater.

## Coding Style & Naming Conventions

Use TypeScript for VuePress config files and Vue single-file components for interactive features. Keep Markdown frontmatter valid YAML and prefer clear kebab-case filenames for posts, for example `sql-optimization-methods.md`. Existing content directories use topic groupings such as `src/posts/tech/`, `src/posts/English/`, `src/posts/interview/`, and `src/posts/demo/`; place new posts in the closest matching folder. Avoid emoji in documentation and code comments.

## Testing Guidelines

There is no dedicated test framework configured. Treat `npm run docs:build` as the required verification step before submitting changes. For visual or component changes, also run `npm run docs:dev` and manually check the affected page, navigation entry, and mobile layout where relevant. If adding a new component, include a small demo page or existing-page usage that can be exercised locally.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style prefixes such as `docs:`, `feat:`, and `style:`. Keep commit messages concise and scoped to the user-visible change, for example `docs: add redis delay queue design` or `feat: add homepage decoration`. Pull requests should describe what changed, list the verification command run, link related issues when applicable, and include screenshots for homepage, layout, or visual component updates.

## Agent-Specific Instructions

When asked to organize documentation according to this wiki style, first read the repository `README.MD` or `README.md` if present. Preserve existing structure and navigation patterns, make the smallest effective edit, and avoid unrelated formatting churn.
