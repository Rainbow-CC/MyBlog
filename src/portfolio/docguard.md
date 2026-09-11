---
title: DocGuard
icon: shield-halved
order: 1
breadcrumb: false
article: false
---

# DocGuard

<div class="project-hero-panel">
  <p class="project-eyebrow">AI Document Audit</p>
  <p class="project-lead">An evidence-first audit agent for reviewing DOCX technical documents and producing traceable findings.</p>
  <p class="project-actions">
    <a href="https://github.com/Rainbow-CC/DocGuard" target="_blank" rel="noopener noreferrer">View on GitHub</a>
    <a href="/MyBlog/portfolio/">Back to Portfolio</a>
  </p>
</div>

## Overview

DocGuard reviews technical documents containing text, tables, embedded Visio objects, and architecture diagrams. It converts the document into a structured audit context so that AI agents can inspect both written and visual information.

## Features

- Extracts paragraphs, tables, images, and embedded objects from DOCX files.
- Converts diagrams into high-resolution images for visual analysis.
- Links each finding to an exact paragraph, table entry, or image region.
- Validates structured findings before including them in the final report.
- Supports additional audit types through independent rule packs and skills.

## Design

Evidence is treated as part of the result rather than supporting decoration. Audit skills make domain decisions, while the application manages task execution, evidence validation, finding collection, and report rendering through a shared contract.

## Implementation

Python + FastAPI + Pydantic + OpenClaw + LibreOffice + Poppler + SQLite
