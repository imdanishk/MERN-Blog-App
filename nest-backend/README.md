# Express to NestJS Migration Guide

This guide covers the migration process from the existing Express.js blog API to a modern NestJS implementation with Swagger documentation.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Key Architecture Changes](#key-architecture-changes)
4. [Migrating Authentication](#migrating-authentication)
5. [Swagger API Documentation](#swagger-api-documentation)
6. [Testing the New API](#testing-the-new-api)
7. [Optimization Highlights](#optimization-highlights)
8. [Conclusion](#conclusion)

## Introduction

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript and combines elements of OOP, FP, and FRP.

**Benefits of migrating to NestJS:**

- **Modularity** - Clear separation of concerns with modules
- **TypeScript Integration** - Type safety, better intellisense
- **Dependency Injection** - Better testability and loose coupling
- **Decorators** - Declarative API endpoints and validation
- **Built-in Swagger Support** - Automatic API documentation
- **Middleware & Guards** - Enhanced request pipeline
- **DTOs & Entities** - Clear data models
- **Exception Filters** - Better error handling

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB

### Installation

1. Create a new NestJS project:

```bash
npm i -g @nestjs/cli
nest new blog-api
cd blog-api
```

2. Install required dependencies:

```bash
npm install --save @nestjs/mongoose mongoose @nestjs/config @nestjs/swagger
npm install --save @clerk/clerk-sdk-node svix imagekit
npm install --save-dev @types/mongoose
```

3. Project structure setup:

Follow the provided project structure to organize your code into modules, controllers, services, and entities.

## Key Architecture Changes

### Express vs NestJS Structure

| Express Structure              | NestJS Structure                              |
| ------------------------------ | --------------------------------------------- |
| routes/user.route.js           | users/users.controller.ts                     |
| controllers/user.controller.js | users/users.service.ts                        |
| models/user.model.js           | users/entities/user.entity.ts                 |
| middlewares/increaseVisit.js   | posts/middleware/increase-visit.middleware.ts |
| N/A                            | users/dto/user.dto.ts                         |

### Database Models to Schema Classes

**Express Mongoose Schema:**

```javascript
const userSchema = new Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  // ...
});
```

**NestJS Mongoose Schema:**

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  clerkUserId: string;

  // ...
}
```

### Route Handlers to Controllers

**Express Route Handler:**

```javascript
router.get('/saved', getUserSavedPosts);
```

**NestJS Controller:**

```typescript
@Get('saved')
@UseGuards(ClerkAuthGuard)
async getUserSavedPosts(@Req() req: Request) {
  return this.usersService.getUserSavedPosts(req['auth'].userId);
}
```

## Migrating Authentication

The migration preserves the existing Clerk authentication system while enhancing it with NestJS guards and middleware:

1. **Auth Middleware**: Verifies Clerk JWT tokens and attaches user data to the request

2. **Auth Guards**: Protects endpoints that require authentication

```typescript
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.auth || !request.auth.userId) {
      throw new UnauthorizedException('Not authenticated!');
    }
    return true;
  }
}
```

3. **Admin Guard**: Restricts access to admin-only endpoints based on Clerk user roles

## Swagger API Documentation

NestJS provides built-in support for Swagger/OpenAPI documentation.

1. **Setup in `main.ts`:**

```typescript
const config = new DocumentBuilder()
  .setTitle('Blog API')
  .setDescription('Blog API documentation')
  .setVersion('1.0')
  .addTag('blog')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'clerk-token',
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

2. **Decorators for endpoints and DTOs:**

```typescript
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns posts and pagination info',
  })
  async getPosts(@Query() queryPostDto: QueryPostDto) {
    // ...
  }
}
```

## Testing the New API

1. **Start the server:**

```bash
npm run start:dev
```

2. **Access Swagger documentation:**

Open your browser and navigate to [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

3. **Test endpoints using Swagger UI or tools like Postman**

## Optimization Highlights

The NestJS migration introduces several optimizations:

1. **Improved Error Handling**:

   - Standardized HTTP exceptions
   - Global exception filter

2. **Request Validation**:

   - DTO-based validation using class-validator
   - Automatic request body transformation

3. **Query Optimization**:

   - Typed query parameters
   - Efficient MongoDB query construction

4. **Type Safety**:

   - TypeScript interfaces and types
   - Mongoose schema typing

5. **Code Organization**:

   - Clear module boundaries
   - Separation of business logic in services
   - Controllers focused on HTTP concerns
   - Entities representing data models

6. **Authentication Improvements**:

   - Guard-based protection
   - Role-based access control
   - Middleware for JWT verification

7. **Documentation**:

   - Comprehensive Swagger documentation
   - API grouping and tagging
   - Parameter and response documentation

## Conclusion

This migration transforms the Express.js blog API into a robust, type-safe, and well-structured NestJS application with comprehensive documentation and enhanced maintainability.
