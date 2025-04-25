# Blog API

A RESTful API for managing a blog platform with posts, comments, and user management using Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Models](#models)
- [Routes](#routes)
- [Middleware](#middleware)
- [Image Upload](#image-upload)
- [Webhooks](#webhooks)
- [Contributing](#contributing)

## Overview

This Blog API provides a backend for building a blog platform with user authentication using Clerk, post management, commenting system, and more. It includes features like post categorization, featured posts, saving posts, and search functionality.

## Features

- **User Management**: User creation, authentication via Clerk
- **Post Management**: CRUD operations for blog posts
- **Comments**: Add and delete comments on posts
- **Featured Posts**: Admin can mark posts as featured
- **Categories**: Categorize posts
- **Search**: Search posts by title
- **Pagination**: Limit number of posts per page
- **Sorting**: Sort posts by date, popularity, etc.
- **Image Upload**: Upload post images via ImageKit
- **Statistics**: Track post views
- **Bookmarks**: Users can save posts for later reading
- **API Documentation**: Interactive Swagger documentation

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Clerk** - Authentication and user management
- **ImageKit** - Image storage and management
- **Swagger** - API documentation

## Project Structure

```
📁 backend
  ┣ 📁 controllers - Business logic for each route
  ┣ 📁 libs - Utility functions and services
  ┣ 📁 middlewares - Express middlewares
  ┣ 📁 models - Mongoose schemas
  ┣ 📁 routes - API route definitions
  ┣ 📁 swagger - Swagger documentation
  ┣ 📄 index.js - Application entry point
  ┣ 📄 .env - Environment variables
  ┗ 📄 package.json - Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Clerk account
- ImageKit account

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/imdanishk/blog-api.git
   cd blog-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables (see section below)

4. Start the server:
   ```
   npm start
   ```

For development with hot reload:

```
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_CONNECTION_URL=mongodb://localhost:27017/blog-api

# Clerk
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# ImageKit
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Client
CLIENT_URL=http://localhost:5173
```

## API Documentation

The API documentation is available using Swagger UI at `/api-docs` when the server is running.

For example, if your server is running on port 3000:

```
http://localhost:3000/api-docs
```

This provides an interactive interface to explore and test all API endpoints.

## Authentication

This API uses Clerk for authentication. All protected routes require a valid JWT token in the Authorization header.

The token is validated using the Clerk middleware.

## Models

### User Model

- `clerkUserId`: Clerk user ID
- `username`: User's username
- `email`: User's email
- `img`: Profile image URL
- `savedPosts`: Array of saved post IDs

### Post Model

- `user`: Reference to User
- `img`: Post image URL
- `title`: Post title
- `slug`: URL-friendly version of title
- `desc`: Brief description
- `category`: Post category
- `content`: Main content
- `isFeatured`: Whether post is featured
- `visit`: View count

### Comment Model

- `user`: Reference to User
- `post`: Reference to Post
- `desc`: Comment content

## Routes

### Posts

- `GET /api/posts` - Get posts with filters, search, and pagination
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create a new post
- `DELETE /api/posts/:id` - Delete a post
- `PATCH /api/posts/feature` - Feature/unfeature a post (admin only)
- `GET /api/posts/upload-auth` - Get ImageKit authentication parameters

### Comments

- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Add a comment to a post
- `DELETE /api/comments/:id` - Delete a comment

### Users

- `GET /api/users/saved` - Get user's saved posts
- `PATCH /api/users/save` - Save/unsave a post

### Webhooks

- `POST /webhooks/clerk` - Webhook for Clerk user events

## Middleware

### Authentication Middleware

Uses Clerk to authenticate requests. Protected routes require a valid JWT token.

### Visit Counter Middleware

Increments post visit count when a post is viewed.

## Image Upload

Images are stored using ImageKit. The API provides authentication parameters for client-side uploads.

## Webhooks

The API includes a webhook endpoint for Clerk user events:

- User creation: Creates a new user in the database
- User deletion: Removes user and related content from the database

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
