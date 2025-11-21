# Habit Tracker Backend

A NestJS-based backend API for tracking daily habits with comprehensive error handling, database migrations, and seeding.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **PostgreSQL** (v12 or higher)

## 🚀 Getting Started

### 1. Install Project

Clone the repository and install dependencies:

```bash
# Clone the repository (if from git)
git clone <repository-url>
cd ht_back

# Install dependencies
npm install
# or if using pnpm
pnpm install
```

### 2. Configure Database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE "habit-tracker";

# Exit psql
\q
```

Update database configuration in `src/data-source.ts` and `src/app.module.ts` if needed:

```typescript
{
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',  // Update with your password
  database: 'habit-tracker',
}
```

### 3. Run Migration Files

Apply database migrations to create tables:

```bash
# Check migration status
npm run migration:show

# Run all pending migrations
npm run migration:run

# (Optional) Seed test users
npm run seed
```

**Expected output:**

```
query: CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
query: CREATE TABLE "user" (...)
query: CREATE TABLE "habit" (...)
query: CREATE TABLE "habit_log" (...)
Migration InitialSchema1763671432800 has been executed successfully.
```

### 4. Run Project

Start the development server:

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at: **http://localhost:3000**

## 📝 Available Scripts

### Development

```bash
npm run start          # Start application
npm run start:dev      # Start with hot reload
npm run start:debug    # Start in debug mode
npm run start:prod     # Start production build
```

### Database Migrations

```bash
npm run migration:show              # Show migration status
npm run migration:run               # Run pending migrations
npm run migration:revert            # Revert last migration
npm run migration:generate <name>   # Generate migration from entity changes
npm run migration:create <name>     # Create blank migration
```

### Database Seeding

```bash
npm run seed           # Run all seeds
npm run seed:users     # Seed test users only
```

### Code Quality

```bash
npm run lint           # Lint code
npm run format         # Format code with Prettier
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
```

## 🧪 Test Users

After running seeds, the following test accounts are available:

| Email               | Password   | Name       |
| ------------------- | ---------- | ---------- |
| `admin@example.com` | `admin123` | Admin User |
| `user@example.com`  | `user123`  | Test User  |
| `demo@example.com`  | `demo123`  | Demo User  |

## 📚 API Documentation

### Authentication Endpoints

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Habit Endpoints

All habit endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### Get All Habits

```http
GET /habits
```

#### Get Habits for Today

```http
GET /habits/today
```

#### Get Weekly Report

```http
GET /habits/report/weekly?weekStart=2025-11-03
```

#### Get Habit Logs for Week

```http
GET /habits/:id/logs?weekStart=2025-11-03
```

#### Create Habit

```http
POST /habits
Content-Type: application/json

{
  "title": "Morning Exercise",
  "description": "30 minutes workout"
}
```

#### Update Habit

```http
PUT /habits/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Toggle Habit Completion

```http
POST /habits/:id/log
Content-Type: application/json

{
  "date": "2025-11-20",
  "done": true
}
```

#### Delete Habit

```http
DELETE /habits/:id
```

## 🏗️ Project Structure

```
ht_back/
├── src/
│   ├── auth/              # Authentication module
│   ├── user/              # User module
│   ├── habit/             # Habit module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── habit.entity.ts
│   │   ├── habit-log.entity.ts
│   │   ├── habit.service.ts
│   │   └── habit.controller.ts
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── exceptions/    # Custom exceptions
│   │   ├── filters/       # Exception filters
│   │   ├── interceptors/  # Response interceptors
│   │   └── interfaces/    # TypeScript interfaces
│   ├── database/
│   │   └── seeds/         # Database seeds
│   ├── migrations/        # Database migrations
│   ├── util/              # Utility functions
│   ├── data-source.ts     # TypeORM DataSource
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── package.json
└── README.md
```

## 🌟 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **Database Seeding** - Test data for development
- ✅ **Standardized API Responses** - Consistent response format
- ✅ **Global Error Handling** - Comprehensive error management
- ✅ **Input Validation** - DTO validation with class-validator
- ✅ **TypeORM Integration** - Type-safe database operations
- ✅ **Weekly Reports** - Habit tracking analytics
- ✅ **Cascade Deletes** - Automatic cleanup of related data

## 🔒 Security Features

- Bcrypt password hashing
- JWT token authentication
- Refresh token support
- HTTP-only cookies for tokens
- CORS configuration
- Input validation and sanitization

## 🛠️ Technologies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Class Validator** - DTO validation
- **Passport** - Authentication middleware

## 📊 Response Format

All API responses follow this standard format:

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": {
    /* response data */
  },
  "timestamp": "2025-11-20T10:30:00.000Z",
  "path": "/habits"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Request failed",
  "error": {
    "message": "Habit with ID 123 not found"
  },
  "timestamp": "2025-11-20T10:30:00.000Z",
  "path": "/habits/123"
}
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running and credentials are correct.

### Migration Already Run

```bash
QueryFailedError: relation "user" already exists
```

**Solution:** Tables already exist. Either drop them or skip migration.

### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change port in `src/main.ts` or kill the process using port 3000.

## 📄 Environment Variables

Create a `.env` file for environment-specific configuration:

```env
PORT=3000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=habit-tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Happy Coding! 🚀**
