# Finance Data Processing and Access Control Backend

## Overview

This project is a backend assignment for a finance dashboard system. It is built with Node.js, Express, MongoDB, Mongoose, and JWT authentication.

The backend supports:

- user and role management
- financial record management
- dashboard summary APIs
- backend-level access control
- input validation and error handling

The project follows a simple MVC structure to keep the code readable and maintainable.

## Objective

The goal of this project is to show backend fundamentals clearly:

- API design
- data modeling
- business logic handling
- role-based access control
- validation and error handling
- maintainable project structure

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator

## Project Structure

```text
src
|-- config
|-- controllers
|-- middlewares
|-- models
|-- routes
|-- utils
|-- app.js
|-- seedDemoData.js
`-- server.js
```

## Design Choices

- Express was used to keep routing and middleware simple.
- MongoDB with Mongoose was used for quick schema design and easy aggregation.
- JWT was used for stateless authentication.
- MVC style was used so routes, controllers, models, and middleware stay separated.
- The implementation is intentionally simple and focused on assignment requirements instead of production-level complexity.

## Roles And Access Control

The system has three roles:

- `viewer`: can access dashboard summary only
- `analyst`: can view records and dashboard summary
- `admin`: can manage users, manage records, and access dashboard summary

Access control is enforced in backend middleware.

## Core Features

### 1. User And Role Management

- create users
- list users
- update user role and status
- support active and inactive users
- restrict actions based on role

### 2. Financial Records Management

Each record contains:

- amount
- type (`income` or `expense`)
- category
- date
- notes
- createdBy

Supported actions:

- create record
- get all records
- get single record
- update record
- delete record
- filter by type
- filter by category
- filter by date range
- paginate records

### 3. Dashboard Summary API

The dashboard summary endpoint returns:

- total income
- total expenses
- net balance
- category-wise totals
- recent activity
- monthly trend

### 4. Validation And Error Handling

The project includes:

- request body validation
- query and param validation
- proper HTTP status codes
- centralized error handling
- duplicate email handling
- invalid token and invalid id handling

### 5. Data Persistence

MongoDB is used as the persistence layer through Mongoose models.

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```powershell
Copy-Item .env.example .env
```

### 3. Add environment values

Example:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=replace_this_with_a_strong_secret
JWT_EXPIRES_IN=1d
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

### 4. Start the server

```bash
npm run dev
```

## Demo Data

This project includes a simple seed script for easier testing.

Run:

```bash
npm run seed
```

This inserts demo users and sample finance records.

Demo credentials:

- `admin@example.com / Admin@123`
- `analyst@example.com / Analyst@123`
- `viewer@example.com / Viewer@123`

## API Base URL

```text
http://localhost:3000
```

## Main API Endpoints

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`

### Records

- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`

### Dashboard

- `GET /api/dashboard/summary`

## Sample Requests

### Login

`POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### Create User

`POST /api/users`

```json
{
  "name": "Aman Verma",
  "email": "aman@example.com",
  "password": "User@123",
  "role": "analyst",
  "status": "active"
}
```

### Create Record

`POST /api/records`

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Freelance",
  "date": "2026-04-01",
  "notes": "Website payment"
}
```

### Filter Records

`GET /api/records?type=expense&category=Food&page=1&limit=10`

### Dashboard Summary With Date Range

`GET /api/dashboard/summary?startDate=2026-01-01&endDate=2026-04-30`

## Testing With Postman

Suggested testing flow:

1. Login and copy the JWT token.
2. Add the token in Postman using `Authorization -> Bearer Token`.
3. Test `GET /api/auth/me`.
4. Test role-specific endpoints using admin, analyst, and viewer accounts.

Expected behavior:

- admin can access all endpoints
- analyst can read records and dashboard summary
- viewer can access dashboard summary only

## Assumptions

- New users are created by an admin instead of self-signup.
- Finance records are shared records for the dashboard, not user-private records.
- Viewer role is limited to summary access only.
- A default admin is automatically created on first server start if it does not exist.

## Tradeoffs

- The project keeps authentication simple with login only.
- No refresh token or logout flow has been added.
- No automated test suite has been added to keep the submission small and focused.
- API documentation is written in this README instead of Swagger.

## Possible Improvements

- add Swagger or Postman collection export
- add unit and integration tests
- add refresh token flow
- add soft delete for records
- add rate limiting
- add search support

## Submission Note

This project is intentionally kept simple, readable, and easy to explain. The focus is on correctness, backend structure, access control, validation, and clean handling of finance data rather than production-level completeness.
