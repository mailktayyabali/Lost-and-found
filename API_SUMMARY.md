# Lost and Found API Summary

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained from the `/auth/login` or `/auth/register` endpoints.

---

## API Endpoints

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-05-20T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

---

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

---

### GET `/auth/me`
Get current authenticated user profile.

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

---

### PUT `/auth/profile`
Update user profile information.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK`

---

### PUT `/auth/password`
Change user password.

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response:** `200 OK`

---

### POST `/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:** `200 OK`

---

### POST `/auth/reset-password`
Reset password with token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

---

## Items Endpoints

### GET `/items`
Get all items with optional filters and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`LOST` or `FOUND`)
- `category` (optional): Filter by category (`Electronics`, `Accessories`, `Clothing`, `Documents`, `Bags`, `Pets`, `Keys`, `Other`)

**Example:**
```
GET /items?page=1&limit=10&status=LOST&category=Electronics
```

**Response:** `200 OK`

---

### GET `/items/search`
Search items by query string.

**Query Parameters:**
- `q` (required): Search query
- `status` (optional): Filter by status

**Example:**
```
GET /items/search?q=laptop&status=LOST
```

**Response:** `200 OK`

---

### GET `/items/:id`
Get a specific item by its ID.

**URL Parameters:**
- `id`: Item ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### POST `/items/:id/view`
Increment view count for an item.

**URL Parameters:**
- `id`: Item ID

**Response:** `200 OK`

---

### GET `/items/user/:userId`
Get all items posted by a specific user.

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### POST `/items`
Create a new lost or found item.

**Authentication:** Required

**Request:** `multipart/form-data`
- `status`: `LOST` or `FOUND` (required)
- `title`: Item title, max 100 characters (required)
- `description`: Item description, max 500 characters (required)
- `category`: One of: `Electronics`, `Accessories`, `Clothing`, `Documents`, `Bags`, `Pets`, `Keys`, `Other` (required)
- `location`: Location where item was lost/found (required)
- `date`: ISO 8601 date string (required)
- `contactName`: Contact name (required)
- `contactEmail`: Valid email address (required)
- `images`: Multiple image files (optional)

**Response:** `201 Created`

---

### PUT `/items/:id`
Update an item.

**Authentication:** Required (owner only)

**URL Parameters:**
- `id`: Item ID

**Request:** `multipart/form-data` (same fields as POST `/items`, all optional)

**Response:** `200 OK`

---

### DELETE `/items/:id`
Delete an item.

**Authentication:** Required (owner or admin)

**URL Parameters:**
- `id`: Item ID

**Response:** `200 OK`

---

### PATCH `/items/:id/resolve`
Mark an item as resolved.

**Authentication:** Required

**URL Parameters:**
- `id`: Item ID

**Response:** `200 OK`

---

## Favorites Endpoints

All favorites endpoints require authentication.

### GET `/favorites`
Get all favorite items for the current user.

**Response:** `200 OK`

---

### POST `/favorites/:itemId`
Add an item to favorites.

**URL Parameters:**
- `itemId`: Item ID (MongoDB ObjectId)

**Response:** `201 Created`

---

### DELETE `/favorites/:itemId`
Remove an item from favorites.

**URL Parameters:**
- `itemId`: Item ID

**Response:** `200 OK`

---

### GET `/favorites/check/:itemId`
Check if an item is favorited by the current user.

**URL Parameters:**
- `itemId`: Item ID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

---

## Messages Endpoints

All messages endpoints require authentication.

### GET `/messages/conversations`
Get all conversations for the current user.

**Response:** `200 OK`

---

### GET `/messages/conversations/:conversationId`
Get messages in a specific conversation.

**URL Parameters:**
- `conversationId`: Conversation ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### POST `/messages`
Send a message to another user.

**Request Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439011",
  "itemId": "507f1f77bcf86cd799439012",
  "content": "Hello, I found your item!"
}
```

**Validation:**
- `receiverId`: Required, valid MongoDB ObjectId
- `itemId`: Optional, valid MongoDB ObjectId
- `conversationId`: Optional, valid MongoDB ObjectId (use instead of itemId for existing conversations)
- `content`: Required, max 1000 characters

**Response:** `201 Created`

---

### PUT `/messages/:messageId/read`
Mark a message as read.

**URL Parameters:**
- `messageId`: Message ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### GET `/messages/unread-count`
Get count of unread messages.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## Search Alerts Endpoints

All search alerts endpoints require authentication.

### GET `/alerts`
Get all search alerts for the current user.

**Response:** `200 OK`

---

### POST `/alerts`
Create a new search alert.

**Request Body:**
```json
{
  "name": "Lost iPhone Alert",
  "filters": {
    "type": "lost",
    "category": "Electronics",
    "keywords": ["iPhone", "phone"]
  }
}
```

**Validation:**
- `name`: Required, max 100 characters
- `filters.type`: Optional, `lost` or `found`
- `filters.category`: Optional, one of the valid categories
- `filters.keywords`: Optional, array of strings

**Response:** `201 Created`

---

### PUT `/alerts/:id`
Update an existing search alert.

**URL Parameters:**
- `id`: Alert ID (MongoDB ObjectId)

**Request Body:** Same as POST `/alerts`

**Response:** `200 OK`

---

### DELETE `/alerts/:id`
Delete a search alert.

**URL Parameters:**
- `id`: Alert ID

**Response:** `200 OK`

---

### GET `/alerts/:id/check-matches`
Check for matching items for a specific alert.

**URL Parameters:**
- `id`: Alert ID

**Response:** `200 OK`

---

## Reviews Endpoints

### GET `/reviews/user/:userId`
Get all reviews for a specific user.

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### POST `/reviews`
Create a review for another user.

**Authentication:** Required

**Request Body:**
```json
{
  "reviewee": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Great person, very helpful!"
}
```

**Validation:**
- `reviewee`: Required, valid MongoDB ObjectId
- `rating`: Required, integer between 1 and 5
- `comment`: Optional, max 500 characters

**Response:** `201 Created`

---

### PUT `/reviews/:id`
Update a review.

**Authentication:** Required (reviewer only)

**URL Parameters:**
- `id`: Review ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response:** `200 OK`

---

### DELETE `/reviews/:id`
Delete a review.

**Authentication:** Required (reviewer or admin)

**URL Parameters:**
- `id`: Review ID

**Response:** `200 OK`

---

## Users Endpoints

All user endpoints are public (no authentication required).

### GET `/users/:userId`
Get public profile of a user.

**URL Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### GET `/users/:userId/stats`
Get statistics for a user.

**URL Parameters:**
- `userId`: User ID

**Response:** `200 OK`

---

### GET `/users/:userId/items`
Get all items posted by a user.

**URL Parameters:**
- `userId`: User ID

**Response:** `200 OK`

---

## Admin Endpoints

All admin endpoints require authentication and admin role.

### GET `/admin/stats`
Get dashboard statistics.

**Response:** `200 OK`

---

### GET `/admin/users`
Get all users.

**Response:** `200 OK`

---

### GET `/admin/items`
Get all items.

**Response:** `200 OK`

---

### DELETE `/admin/users/:id`
Delete a user.

**URL Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### DELETE `/admin/items/:id`
Delete an item.

**URL Parameters:**
- `id`: Item ID (MongoDB ObjectId)

**Response:** `200 OK`

---

### GET `/admin/activity`
Get activity log.

**Response:** `200 OK`

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or bad request
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting

The API implements rate limiting:
- **Auth endpoints** (`/auth/*`): Stricter limits
- **Create endpoints**: Moderate limits
- **General API endpoints**: Standard limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

---

## Notes

1. **Base URL**: All endpoints are prefixed with `/api`
2. **Authentication**: Use Bearer token in Authorization header for protected endpoints
3. **File Uploads**: Item creation/update uses `multipart/form-data` for image uploads
4. **IDs**: All IDs are MongoDB ObjectIds (24-character hex strings)
5. **Dates**: Use ISO 8601 format for date fields
6. **Pagination**: Use `page` and `limit` query parameters for paginated endpoints
7. **Categories**: Valid categories are: `Electronics`, `Accessories`, `Clothing`, `Documents`, `Bags`, `Pets`, `Keys`, `Other`
8. **Status**: Item status must be either `LOST` or `FOUND`

