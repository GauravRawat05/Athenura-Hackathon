# Auth APIs Documentation

## API #1: Register User

POST http://localhost:5000/api/v1/auth/register

Headers:
Content-Type: application/json

Payload:
```json
{
  "fullName": "string (required, min 2, max 100 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars, 1 uppercase, 1 special symbol)",
  "phone": "number (optional, positive integer)",
  "dateOfBirth": "date (optional, past date)",
  "collegeOrUniversity": "string (optional, max 200 chars)",
  "graduationYear": "number (optional)",
  "resumeLink": "string (optional, valid URI)",
  "skills": "array of strings (optional)",
  "gender": "string (required, Male, Female, or Other)"
}
```

Example Payload:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "password": "Password@123",
  "phone": 1234567890,
  "dateOfBirth": "2000-01-01",
  "collegeOrUniversity": "Tech University",
  "graduationYear": 2024,
  "resumeLink": "https://example.com/resume.pdf",
  "skills": [
    "JavaScript",
    "Node.js"
  ],
  "gender": "Male"
}
```

Response (201):
```json
{
  "statusCode": 201,
  "data": {},
  "message": "OTP has been sent to your email",
  "success": true
}
```


## API #2: Login User

POST http://localhost:5000/api/v1/auth/login

Headers:
Content-Type: application/json

Payload:
```json
{
  "email": "string (optional, valid email)",
  "phone": "number (optional, positive integer)",
  "password": "string (required)"
}
```
*Note: Either email or phone is required.*

Example Payload:
```json
{
  "email": "johndoe@example.com",
  "password": "Password@123"
}
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_object_id",
      "fullName": "John Doe",
      "email": "johndoe@example.com"
    },
    "accessToken": "jwt_access_token_string",
    "refreshToken": "jwt_refresh_token_string"
  },
  "message": "User logged in successfully",
  "success": true
}
```


## API #3: Logout User

POST http://localhost:5000/api/v1/auth/logout

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": {},
  "message": "User logged out",
  "success": true
}
```


# Admin Hackathons APIs Documentation

## API #4: Create Hackathon

POST http://localhost:5000/api/v1/admin/hackathons/create-hackathon

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Payload:
```json
{
  "title": "string (required)",
  "slug": "string (required)",
  "description": "string (required)",
  "mode": "array of strings (optional, valid: 'Solo', 'Both')",
  "allowedModes": "array of strings (optional)",
  "startDate": "date (required)",
  "endDate": "date (required, after startDate)",
  "registrationDeadline": "date (required, before startDate)",
  "submissionDeadline": "date (required, between startDate and endDate)",
  "prizePool": "number (required)",
  "registrationFee": "number (required)",
  "currency": "string (required, valid: 'INR', 'DOLLAR')",
  "minTeamSize": "number (required)",
  "maxTeamSize": "number (optional, greater than minTeamSize)",
  "technologyDomains": "array of strings (required)",
  "rules": "array of strings (required)",
  "judgingCriteria": [
    {
      "name": "string (required)",
      "weight": "number (required)"
    }
  ],
  "eligibility": "array of strings OR object with studentOnly (boolean) and allowedGraduationYears (array of numbers) (required)",
  "sponsors": [
    {
      "name": "string (required)",
      "logoUrl": "string (optional, valid URI)"
    }
  ]
}
```

Response (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "hackathon_object_id",
    "title": "Hackathon Name",
    "slug": "hackathon-name"
  },
  "message": "Hackathon created successfully",
  "success": true
}
```


## API #5: Get All Hackathons (Admin)

GET http://localhost:5000/api/v1/admin/hackathons/hackathons

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "hackathon_object_id",
      "title": "Hackathon Name"
    }
  ],
  "message": "Hackathons fetched successfully",
  "success": true
}
```


## API #6: Get Hackathon Details

GET http://localhost:5000/api/v1/admin/hackathons/:hackathonId

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "hackathon_object_id",
    "title": "Hackathon Name"
  },
  "message": "Hackathon details fetched successfully",
  "success": true
}
```


## API #7: Update Hackathon Details

PATCH http://localhost:5000/api/v1/admin/hackathons/:hackathonId

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Payload:
```json
{
  // Same as Create Hackathon payload, but all fields are optional
}
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "hackathon_object_id",
    "title": "Updated Hackathon Name"
  },
  "message": "Hackathon updated successfully",
  "success": true
}
```


## API #8: Update Hackathon Rules

PATCH http://localhost:5000/api/v1/admin/hackathons/:hackathonId/rules

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Payload:
```json
{
  "rules": ["Rule 1", "Rule 2", "Rule 3"]
}
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Hackathon rules updated successfully",
  "success": true
}
```


## API #9: Delete Hackathon

DELETE http://localhost:5000/api/v1/admin/hackathons/:hackathonId

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Hackathon deleted successfully",
  "success": true
}
```


## API #10: List Hackathon Registrations

GET http://localhost:5000/api/v1/admin/hackathons/:hackathonId/registrations?page=1&limit=20&status=pending&paymentStatus=completed&mode=solo&search=keyword

Headers:
Authorization: Bearer <access_token>

Query Parameters:
- `page`: number (optional, default 1)
- `limit`: number (optional, default 20)
- `status`: string (optional, valid: 'pending', 'confirmed', 'cancelled', 'payment_failed')
- `paymentStatus`: string (optional, valid: 'pending', 'completed', 'failed', 'refunded')
- `mode`: string (optional, valid: 'solo', 'team')
- `search`: string (optional)

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "registrations": [],
    "total": 100,
    "page": 1,
    "limit": 20
  },
  "message": "Registrations fetched successfully",
  "success": true
}
```


# Public APIs Documentation

## API #11: Get All Public Hackathons

GET http://localhost:5000/api/v1/public/hackathons

Headers:
None needed

Response (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "hackathon_object_id",
      "title": "Hackathon Name",
      "description": "...",
      "startDate": "..."
    }
  ],
  "message": "Hackathons fetched successfully",
  "success": true
}
```


## API #12: Get Public Hackathon Details

GET http://localhost:5000/api/v1/public/hackathons/:hackathonId

Headers:
None needed

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "hackathon_object_id",
    "title": "Hackathon Name",
    "description": "...",
    "rules": []
  },
  "message": "Hackathon fetched successfully",
  "success": true
}
```


## API #13: Get Public Hackathon Winners

GET http://localhost:5000/api/v1/public/hackathons/:hackathonId/winners

Headers:
None needed

Response (200):
```json
{
  "statusCode": 200,
  "data": [
    {
      "teamName": "Winning Team",
      "position": 1,
      "prize": 5000
    }
  ],
  "message": "Winners fetched successfully",
  "success": true
}
```


## API #14: Verify Certificate

GET http://localhost:5000/api/v1/public/certificates/verify/:certificateCode

Headers:
None needed

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "certificateCode": "CERT-12345",
    "verified": true,
    "issuedTo": "Mock User"
  },
  "message": "Certificate verified successfully",
  "success": true
}
```

# Results APIs Documentation

## API #15: Compute Scores & Ranks (Admin)

POST http://localhost:5000/api/v1/admin/hackathons/:hackathonId/results/compute

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Scores and ranks computed successfully",
  "success": true
}
```

## API #16: Override Ranks/Awards (Admin)

PATCH http://localhost:5000/api/v1/admin/hackathons/:hackathonId/results/override

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Payload:
```json
{
  "submissionId": "string (optional)",
  "newRank": "number (optional)",
  "award": "string (optional)"
}
```

Response (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Ranks and awards overridden successfully",
  "success": true
}
```

## API #17: Public Winners Cards

GET http://localhost:5000/api/v1/hackathons/:hackathonId/winners

Headers:
None needed

Response (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Winners fetched successfully",
  "success": true
}
```

## API #18: Authenticated Result View

GET http://localhost:5000/api/v1/hackathons/:hackathonId/results

Headers:
Authorization: Bearer <access_token>

Response (200):
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Results fetched successfully",
  "success": true
}
```