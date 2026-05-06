# Hackathon Athenura - Backend API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

---

## Authentication

All admin endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### How to get a token

1. **Register a user**
   ```
   POST /auth/register
   ```

2. **Login**
   ```
   POST /auth/login
   ```
   - Returns: `{ accessToken, refreshToken, user }`

---

## Admin Users API

### 1. List All Users
- **Endpoint**: `GET /admin/users`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Middleware**: `verifyJWT`, `verifyAdmin`, `asyncHandler`
- **Response** (Success):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "user-id-1",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "status": "active"
      }
    ]
  }
  ```
- **Response** (Error):
  ```json
  {
    "success": false,
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```

---

### 2. Get User Details by ID
- **Endpoint**: `GET /admin/users/:userId`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **URL Parameters**:
  - `userId` (required): MongoDB user ID
- **Middleware**: `verifyJWT`, `verifyAdmin`, `asyncHandler`
- **Example URL**: `GET /admin/users/507f1f77bcf86cd799439011`
- **Response** (Success):
  ```json
  {
    "success": true,
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "active",
      "university": "IIT Delhi",
      "createdAt": "2026-05-07T10:30:00Z"
    }
  }
  ```
- **Response** (Error):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "User not found"
  }
  ```

---

### 3. Suspend User
- **Endpoint**: `PATCH /admin/users/:userId/suspend`
- **Method**: PATCH
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **URL Parameters**:
  - `userId` (required): MongoDB user ID
- **Middleware**: `verifyJWT`, `verifyAdmin`, `asyncHandler`
- **Body**: (Optional) Empty or any additional data
- **Example URL**: `PATCH /admin/users/507f1f77bcf86cd799439011/suspend`
- **Response** (Success):
  ```json
  {
    "success": true,
    "message": "User suspended successfully",
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "status": "suspended"
    }
  }
  ```
- **Response** (Error):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "User not found"
  }
  ```

---

### 4. Restore User
- **Endpoint**: `PATCH /admin/users/:userId/restore`
- **Method**: PATCH
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **URL Parameters**:
  - `userId` (required): MongoDB user ID
- **Middleware**: `verifyJWT`, `verifyAdmin`, `asyncHandler`
- **Body**: (Optional) Empty or any additional data
- **Example URL**: `PATCH /admin/users/507f1f77bcf86cd799439011/restore`
- **Response** (Success):
  ```json
  {
    "success": true,
    "message": "User restored successfully",
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "status": "active"
    }
  }
  ```
- **Response** (Error):
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "User not found"
  }
  ```

---

### 5. Reset User Password
- **Endpoint**: `POST /admin/users/:userId/resetpassword`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **URL Parameters**:
  - `userId` (required): MongoDB user ID
- **Middleware**: `verifyJWT`, `verifyAdmin`, `validate(resetPasswordValidation)`, `asyncHandler`
- **Request Body**:
  ```json
  {
    "password": "NewPassword123!"
  }
  ```
- **Validation Rules**:
  - `password` (required): String, minimum 6 characters, must contain uppercase, lowercase, number, and special character
- **Example URL**: `POST /admin/users/507f1f77bcf86cd799439011/resetpassword`
- **Response** (Success):
  ```json
  {
    "success": true,
    "message": "Password reset successfully",
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "passwordUpdatedAt": "2026-05-07T10:35:00Z"
    }
  }
  ```
- **Response** (Validation Error):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation error",
    "errors": [
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
  ```

---

## Admin Settings API

### 1. Get Admin Settings
- **Endpoint**: `GET /admin/settings`
- **Method**: GET
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Middleware**: `verifyJWT`, `verifyAdmin`, `asyncHandler`
- **Response** (Success):
  ```json
  {
    "success": true,
    "data": {
      "_id": "settings-id",
      "paymentMethod": "razorpay",
      "maintenanceMode": false,
      "emailNotificationsEnabled": true,
      "maxRegistrationsPerUser": 3,
      "updatedAt": "2026-05-07T10:30:00Z"
    }
  }
  ```
- **Response** (Error):
  ```json
  {
    "success": false,
    "statusCode": 500,
    "message": "Failed to retrieve settings"
  }
  ```

---

### 2. Update Payment Configuration
- **Endpoint**: `PATCH /admin/settings/payment`
- **Method**: PATCH
- **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Middleware**: `verifyJWT`, `verifyAdmin`, `validate(updatePaymentValidation)`, `asyncHandler`
- **Request Body**:
  ```json
  {
    "paymentMethod": "razorpay",
    "razorpayApiKey": "rzp_live_xxxxx",
    "razorpayApiSecret": "xxxxx",
    "currencyCode": "INR",
    "transactionFee": 2.5
  }
  ```
- **Validation Rules**:
  - `paymentMethod` (required): String, allowed values: "razorpay", "stripe", "paypal"
  - `razorpayApiKey` (optional): String
  - `razorpayApiSecret` (optional): String
  - `currencyCode` (optional): String
  - `transactionFee` (optional): Number
- **Response** (Success):
  ```json
  {
    "success": true,
    "message": "Payment settings updated successfully",
    "data": {
      "_id": "settings-id",
      "paymentMethod": "razorpay",
      "currencyCode": "INR",
      "transactionFee": 2.5,
      "updatedAt": "2026-05-07T10:40:00Z"
    }
  }
  ```
- **Response** (Validation Error):
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Validation error",
    "errors": [
      {
        "field": "paymentMethod",
        "message": "Invalid payment method"
      }
    ]
  }
  ```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

---
