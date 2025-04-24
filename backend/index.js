import express from "express";
import connectDB from "./libs/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'A RESTful API for a blog application with posts, comments, and user management',
      contact: {
        name: 'API Support',
        email: 'support@blogapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB id of the post'
            },
            user: {
              type: 'string',
              description: 'User ID reference'
            },
            img: {
              type: 'string',
              description: 'Image URL'
            },
            title: {
              type: 'string',
              description: 'Post title'
            },
            slug: {
              type: 'string',
              description: 'URL-friendly version of the title'
            },
            desc: {
              type: 'string',
              description: 'Brief description of the post'
            },
            category: {
              type: 'string',
              description: 'Post category',
              default: 'general'
            },
            content: {
              type: 'string',
              description: 'Main content of the post'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Whether the post is featured',
              default: false
            },
            visit: {
              type: 'integer',
              description: 'Number of visits/views',
              default: 0
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the post was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the post was last updated'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['desc'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB id of the comment'
            },
            user: {
              type: 'string',
              description: 'User ID reference'
            },
            post: {
              type: 'string',
              description: 'Post ID reference'
            },
            desc: {
              type: 'string',
              description: 'Comment content'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the comment was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the comment was last updated'
            }
          }
        },
        User: {
          type: 'object',
          required: ['clerkUserId', 'username', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB id of the user'
            },
            clerkUserId: {
              type: 'string',
              description: 'Clerk user ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            img: {
              type: 'string',
              description: 'User profile image URL'
            },
            savedPosts: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of saved post IDs'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the user was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the user was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'integer',
              description: 'HTTP status code'
            },
            stack: {
              type: 'string',
              description: 'Error stack trace'
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './swagger/*.js'], // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

// Configure CORS properly
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Clerk middleware
app.use(clerkMiddleware());

// Webhooks don't need JSON parsing (uses raw)
app.use("/webhooks", webhookRouter);

// Parse JSON for other routes
app.use(express.json());

// API routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";
  
  res.status(status).json({
    message,
    status,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}!`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});