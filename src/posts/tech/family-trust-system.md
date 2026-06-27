---
#cover: /assets/images/cover2.jpg
icon: pen-to-square
title: Family Trust System Architecture
date: 2025-03-16
category:
  - Technical
tags: ["system", "architecture"]
#article: false
#sticky: true
---
# Family Trust System Architecture

Following the release of the new trust classification regulations in 2023, the company began building a family service trust system to support the new service trust business line.

## System Overview

The application adopts a frontend-backend separation architecture. The frontend UI is an expansion of the existing family trust business management system, built as a traditional Java web application. The technical stack and key components include Nginx + Keepalived (for high availability), Redis, Spring Cloud Gateway, Eureka, Apollo (for configuration management), and a scheduled job framework. The technical architecture diagram is shown below:

![Technical Architecture Diagram](/assets/business/信托技术架构.png)

## System Design Analysis

To be continued...
