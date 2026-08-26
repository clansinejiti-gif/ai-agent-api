# AI Student Recommendation Engine API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-v4-blue.svg)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI--3.0-brightgreen.svg)
![Security](https://img.shields.io/badge/Auth-Session--Based-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A production-ready RESTful backend API for an **AI Recommendation Platform**.  
It collects, manages, and structures student data (academic background, career ambitions, current skill sets, and learning preferences) and combines it with catalog data to generate rich, structured context payloads for an AI Recommendation Agent.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Database / Session Store Setup](#4-database--session-store-setup)
  - [5. Run the Application](#5-run-the-application)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Available Endpoints](#available-endpoints)
- [Authentication & Security](#authentication--security)
- [Error Handling](#error-handling)
- [Project Structure Details](#project-structure-details)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture Overview

The API follows a strict **Layered Architecture** pattern to keep concerns cleanly separated:

```
[Client / Web App]
       │
       │ (HTTP Requests + Session Cookies)
       ▼
[Express.js Server]
       ├── Router Layer          (src/routes)
       ├── Security & Validation (src/middlewares)
       ├── Controller Layer      (src/controllers)
       ├── Service Layer         (src/services)
       └── Data Store / AI Context Engine
```

**Request flow (mandatory):**  
`Route → Middleware → Controller → Service → Data Store / AI Payload Generator`

---

## Directory Structure

```
ai-agent-api/
├── src/
│   ├── config/              # DB connection, session store, environment config
│   ├── controllers/         # HTTP request/response handlers
│   ├── middlewares/         # auth, role-based access, error handling, rate-limiting
│   ├── routes/              # Route definitions + OpenAPI/Swagger JSDoc
│   ├── services/            # Business logic + AI context construction
│   ├── utils/               # Response helpers, validation schemas, logger
│   └── app.js               # Express app initialization & middleware orchestration
├── server.js                # Server entry point
├── package.json
├── .env.example
└── README.md
```

---

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Runtime            | Node.js ≥ 18                        |
| Framework          | Express.js                          |
| Authentication     | express-session (HTTP-only cookies) |
| Session Store      | connect-mongo / Redis / SQLite      |
| Password Hashing   | bcrypt                              |
| Validation         | Joi / express-validator             |
| API Documentation  | swagger-jsdoc + swagger-ui-express  |
| Logging            | Winston / Morgan                    |

> **Note:** JWTs are **not** used. Session-based authentication is mandatory.

---

## Prerequisites

- Node.js ≥ 18
- npm or yarn
- MongoDB (recommended) **or** Redis **or** SQLite for persistent session storage
- Git

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai-agent-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

#### `.env.example`

```env
# Server
NODE_ENV=development
PORT=3000

# Session
SESSION_SECRET=your-super-secret-session-key-change-in-production
SESSION_MAX_AGE=86400000          # 24 hours in milliseconds

# Database / Session Store (choose one)
# Option 1: MongoDB (recommended)
MONGODB_URI=mongodb://localhost:27017/ai_recommendation_engine

# Option 2: Redis
# REDIS_URL=redis://localhost:6379

# Option 3: SQLite (development only)
# SQLITE_PATH=./data/sessions.sqlite

# Cookie settings (production)
COOKIE_SECURE=true                # set to true in production (HTTPS)
COOKIE_SAME_SITE=strict
COOKIE_HTTP_ONLY=true
```

### 4. Database / Session Store Setup

#### Using MongoDB (recommended)

1. Start MongoDB locally or use a cloud instance (MongoDB Atlas).
2. The application will automatically create the necessary collections on first run.
3. Session store is backed by `connect-mongo`.

#### Using Redis

1. Start a Redis server.
2. Update `REDIS_URL` in `.env`.
3. The session middleware will use `connect-redis`.

#### Using SQLite (development only)

1. Ensure the `data/` directory exists.
2. Set `SQLITE_PATH` in `.env`.
3. Sessions will be persisted in the SQLite file.

> No traditional migration scripts are required for the current schema (documents are created on demand). If you later add a relational database, place migration commands here.

### 5. Run the Application

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port defined in `.env`).

---

## API Documentation (Swagger)

Interactive OpenAPI documentation is available at:

```
http://localhost:3000/api-docs
```

The full OpenAPI specification is generated with `swagger-jsdoc` and served via `swagger-ui-express`.

---

## Available Endpoints

### Module A – Authentication & Session Management (`/api/v1/auth`)

| Method | Endpoint                  | Access          | Description                          |
|--------|---------------------------|-----------------|--------------------------------------|
| POST   | `/api/v1/auth/register`   | Public          | Register a new user (bcrypt hashed)  |
| POST   | `/api/v1/auth/login`      | Public          | Login & create session cookie        |
| POST   | `/api/v1/auth/logout`     | Authenticated   | Destroy session                      |
| GET    | `/api/v1/auth/me`         | Authenticated   | Get current session user metadata    |

### Module B – Student Profile & Preferences (`/api/v1/profiles`)

| Method | Endpoint                  | Access                  | Description                              |
|--------|---------------------------|-------------------------|------------------------------------------|
| GET    | `/api/v1/profiles/me`     | Authenticated (student) | Retrieve student profile & skills        |
| PUT    | `/api/v1/profiles/me`     | Authenticated (student) | Update profile for AI context builder    |

### Module C – Catalog Management

| Method | Endpoint                     | Access                | Description                              |
|--------|------------------------------|-----------------------|------------------------------------------|
| GET    | `/api/v1/books`              | Authenticated         | List books (pagination + filtering)      |
| POST   | `/api/v1/books`              | Authenticated (admin) | Add a new book to the catalog            |
| GET    | `/api/v1/careers/tracks`     | Authenticated         | List career tracks / roadmaps            |

### Module D – AI Recommendation Engine (`/api/v1/ai`)

| Method | Endpoint                        | Access                  | Description                                           |
|--------|---------------------------------|-------------------------|-------------------------------------------------------|
| POST   | `/api/v1/ai/recommendations`    | Authenticated (student) | Generate structured AI recommendation context payload |

---

## Authentication & Security

- **Session-based authentication** using `express-session`.
- Session cookies:
  - `httpOnly: true`
  - `sameSite: 'strict'`
  - `secure: true` (in production)
- Role-Based Access Control (RBAC) via `roleMiddleware.js` (`student` / `admin`).
- Passwords are hashed with **bcrypt**.
- All protected routes require a valid `connect.sid` cookie.

---

## Error Handling

All unhandled errors are caught by a centralized error middleware and returned in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": ["Field 'targetRole' is required."]
  }
}
```

---

## Project Structure Details

| Folder / File          | Responsibility                                                                 |
|------------------------|--------------------------------------------------------------------------------|
| `src/config/`          | Database connection, session store initialization, environment loading         |
| `src/routes/`          | HTTP path definitions only (maps to controllers)                               |
| `src/middlewares/`     | `authMiddleware`, `roleMiddleware`, `errorHandler`, validation, rate-limiting  |
| `src/controllers/`     | Extract request data → call services → return standardized JSON responses      |
| `src/services/`        | Business logic, profile + catalog combination, AI context payload generation   |
| `src/utils/`           | `successResponse`, `errorResponse`, validation schemas, logger                 |
| `src/app.js`           | Express app setup and middleware orchestration                                 |
| `server.js`            | Server bootstrap                                                               |

---

## Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "lint": "eslint .",
  "test": "jest"
}
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please keep the layered architecture and coding standards intact.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

**Built clean, modular, and secure.**  
— Following the assignment specification by Gita (Lead Backend Developer)
```
```