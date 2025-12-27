# FindIt Backend API

Backend REST API for the FindIt Lost and Found platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Item Management**: CRUD operations for lost and found items
- **User Management**: User profiles, statistics, and reviews
- **Messaging System**: Real-time messaging between users
- **Search & Filters**: Advanced search with multiple filter options
- **Favorites**: Save and manage favorite items
- **Search Alerts**: Create alerts for automatic item matching
- **Reviews & Ratings**: User rating and review system
- **Admin Dashboard**: Platform statistics and management
- **File Upload**: Image upload to Cloudinary
- **Email Notifications**: Email service for notifications

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)
- Email service credentials (optional, for email notifications)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/findit

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@findit.com
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Items
- `GET /api/items` - Get all items (with filters, pagination)
- `GET /api/items/search` - Search items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create item (protected)
- `PUT /api/items/:id` - Update item (protected, owner)
- `DELETE /api/items/:id` - Delete item (protected, owner/admin)
- `PATCH /api/items/:id/resolve` - Mark as resolved (protected)
- `GET /api/items/user/:userId` - Get user's items

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites/:itemId` - Add favorite (protected)
- `DELETE /api/favorites/:itemId` - Remove favorite (protected)
- `GET /api/favorites/check/:itemId` - Check favorite status (protected)

### Messages
- `GET /api/messages/conversations` - Get conversations (protected)
- `GET /api/messages/conversations/:conversationId` - Get conversation (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:messageId/read` - Mark as read (protected)
- `GET /api/messages/unread-count` - Get unread count (protected)

### Search Alerts
- `GET /api/alerts` - Get user alerts (protected)
- `POST /api/alerts` - Create alert (protected)
- `PUT /api/alerts/:id` - Update alert (protected)
- `DELETE /api/alerts/:id` - Delete alert (protected)

### Reviews
- `GET /api/reviews/user/:userId` - Get user reviews
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected, reviewer)
- `DELETE /api/reviews/:id` - Delete review (protected, reviewer/admin)

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/stats` - Get user statistics
- `GET /api/users/:userId/items` - Get user's items

### Admin
- `GET /api/admin/stats` - Get dashboard stats (admin)
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/items` - Get all items (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `DELETE /api/admin/items/:id` - Delete item (admin)
- `GET /api/admin/activity` - Get activity log (admin)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   └── cloudinary.js # Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication
│   │   ├── errorHandler.js # Error handling
│   │   ├── upload.js    # File upload
│   │   └── rateLimiter.js # Rate limiting
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation
- CORS configuration
- Helmet.js for security headers
- File upload validation

## Error Handling

All errors are handled centrally through the error handler middleware. Errors are returned in a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Additional error details"]
}
```

## Testing

Run tests (when implemented):
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `MONGODB_URI` to production database
3. Update `FRONTEND_URL` to production frontend URL
4. Set secure `JWT_SECRET`
5. Configure production email service
6. Set up Cloudinary production account

## License

ISC

