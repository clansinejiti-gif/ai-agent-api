# AI Student Recommendation Engine API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-v4-blue.svg)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI--3.0-brightgreen.svg)
![Security](https://img.shields.io/badge/Auth-Session--Based-orange.svg)

A production-ready RESTful backend API designed to collect, manage, and structure student profiles, learning preferences, and career catalog data into rich context payloads for AI Recommendation Agents[cite: 1].

---

## Architecture Overview

The codebase is structured following a strict **Layered Architecture** pattern (`Route -> Middleware -> Controller -> Service -> Store/AI Context Engine`)[cite: 1]:

```text
[Client / Web App]
       │ (HTTP Requests + Cookie Session)
       ▼
[Express.js Server]
       ├── Router Layer (src/routes)
       ├── Security & Validation Middlewares (src/middlewares)
       ├── Controller Layer (src/controllers)
       ├── Service Layer (src/services)
       |── Database Store & AI Payload Generator