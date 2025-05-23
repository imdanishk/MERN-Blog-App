# 📝 Blog Application – Full Stack Project

This repository contains a complete blog application with full-stack implementation. The frontend is built with React, and two backend versions are provided:

- ✅ **Node/Express backend** (`backend` folder)
- 🚀 **NestJS backend** (`nest-backend` folder)

Both versions of the backend use MongoDB as the database and are documented using Swagger.

---

## 📁 Project Structure

```

.
├── frontend/          # React application
├── backend/           # Node/Express backend
├── nest-backend/      # NestJS backend
└── README.md

```

---

## 🌐 Features

### ✅ Common Features (in both backends)

- User registration and authentication (normal & admin roles)
- CRUD operations on posts
- Comment system
- Save/favorite posts
- Admin moderation (posts, users, comments)
- Swagger API documentation
- MongoDB as the database

### 🔐 Authentication

- Clerk-based authentication for managing users and sessions
- Role-based access control
- JWT verification via middleware and guards (in NestJS)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance
- Clerk API keys (if applicable)

### 1️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Runs the app in development mode. Visit: `http://localhost:5173`

### 2️⃣ Express Backend Setup

```bash
cd backend
npm install
npm run dev
```

> Server runs at: `http://localhost:3000`
> Swagger docs: `http://localhost:3000/api-docs`

### 3️⃣ NestJS Backend Setup

```bash
cd nest-backend
npm install
npm run start:dev
```

> Server runs at: `http://localhost:3001`
> Swagger docs: `http://localhost:3001/api-docs`

---

## 📘 API Documentation

Both backends include Swagger-generated documentation.

- Express: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- NestJS: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

These docs include:

- Endpoint summaries
- Request/response schemas
- Auth requirement indicators
- Role-based access info

---

## 🛠 Technologies Used

### Frontend

- React
- React Router
- Axios
- Clerk for auth
- Tailwind CSS / Styled Components

### Backend (Express)

- Express.js
- Mongoose
- Swagger UI
- Middleware-based auth

### Backend (NestJS)

- NestJS
- TypeScript
- Mongoose + @nestjs/mongoose
- Guards, DTOs, Pipes
- Swagger with decorators

---

## 🧪 Testing

Use tools like Postman or Swagger UI to test APIs. Authentication endpoints require valid Clerk tokens.

---

## 📦 Folder Highlights

### `/frontend`

React client with routing, authentication handling, and UI components for posts, comments, and favorites.

### `/backend`

Express REST API with routers, controllers, middleware, and Swagger docs.

### `/nest-backend`

Modular NestJS implementation with controllers, services, DTOs, and guards.

---

## 📌 Migration Notes

- Refer to the [`Express to NestJS Migration Guide`](#) (if included) for an architectural breakdown.
- NestJS introduces better code structure, type safety, and testability.

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [NestJS](https://nestjs.com)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Swagger](https://swagger.io)
- [Clerk](https://clerk.dev)
