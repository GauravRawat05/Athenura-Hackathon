# Team APIs Documentation

## API #46: Create Team


POST http://localhost:5000/api/hackathons/:hackathonId/teams


Headers:

Authorization: Bearer <access_token>
Content-Type: application/json


Payload:
json
{
  "name": "string (required, min 3, max 50 chars)",
  "description": "string (optional, max 500 chars)"
}


Example Payload:
json
{
  "name": "Code Warriors",
  "description": "A team of passionate developers building innovative solutions"
}


Response (201):
json
{
  "statusCode": 201,
  "data": {
    "_id": "team_object_id",
    "hackathonId": "hackathon_object_id",
    "name": "Code Warriors",
    "description": "A team of passionate developers building innovative solutions",
    "leader": {
      "_id": "user_object_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "userId": {
          "_id": "user_object_id",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "role": "leader",
        "joinedAt": "2026-05-06T14:00:00.000Z"
      }
    ],
    "isActive": true,
    "createdAt": "2026-05-06T14:00:00.000Z",
    "updatedAt": "2026-05-06T14:00:00.000Z"
  },
  "message": "Team created successfully"
}




## API #47: Get Team Details


GET http://localhost:5000/api/teams/:teamId


Headers:

Authorization: Bearer <access_token>


Response (200):
json
{
  "statusCode": 200,
  "data": {
    "_id": "team_object_id",
    "hackathonId": {
      "_id": "hackathon_object_id",
      "title": "Hackathon Name"
    },
    "name": "Code Warriors",
    "description": "A team of passionate developers building innovative solutions",
    "leader": {
      "_id": "user_object_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "userId": {
          "_id": "user_object_id",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "role": "leader",
        "joinedAt": "2026-05-06T14:00:00.000Z"
      }
    ],
    "isActive": true,
    "createdAt": "2026-05-06T14:00:00.000Z",
    "updatedAt": "2026-05-06T14:00:00.000Z"
  },
  "message": "Team fetched successfully"
}


## API #48: Update Team Metadata
PATCH http://localhost:5000/api/teams/:teamId


Headers:
Authorization: Bearer <access_token>
Content-Type: application/json


Payload:
json
{
  "name": "string (optional, min 3, max 50 chars)",
  "description": "string (optional, max 500 chars)",
  "leader": "string (optional, user ID of new leader - must be existing team member)"
}


Example Payload (Update name and description):
json
{
  "name": "Code Warriors Pro",
  "description": "Updated description for our awesome team"
}


Example Payload (Transfer leadership):
json
{
  "leader": "6641234567890abcdef123456"
}


Response (200):
json
{
  "statusCode": 200,
  "data": {
    "_id": "team_object_id",
    "hackathonId": "hackathon_object_id",
    "name": "Code Warriors Pro",
    "description": "Updated description for our awesome team",
    "leader": "user_object_id",
    "members": [...],
    "isActive": true,
    "createdAt": "2026-05-06T14:00:00.000Z",
    "updatedAt": "2026-05-06T14:05:00.000Z"
  },
  "message": "Team updated successfully"
}




## API #52: Remove Member from Team


DELETE http://localhost:5000/api/teams/:teamId/members/:userId


Headers:

Authorization: Bearer <access_token>


Response (200):
json
{
  "statusCode": 200,
  "data": {
    "_id": "team_object_id",
    "hackathonId": "hackathon_object_id",
    "name": "Code Warriors",
    "leader": "user_object_id",
    "members": [],
    "isActive": true,
    "createdAt": "2026-05-06T14:00:00.000Z",
    "updatedAt": "2026-05-06T14:10:00.000Z"
  },
  "message": "Member removed successfully"
}


Note: Only team leader can remove members. Team leader cannot be removed directly - transfer leadership first.



## API #49: Invite Member to Team

POST http://localhost:5000/api/teams/:teamId/invitations

Headers:
Authorization: Bearer <access_token>
Content-Type: application/json

Payload:
json
{
  "email": "string (required, valid registered email)"
}

Example Payload:
json
{
  "email": "jane.doe@example.com"
}

Response (201):
json
{
  "statusCode": 201,
  "data": {
    "invitation": {
      "_id": "invitation_object_id",
      "teamId": "team_object_id",
      "invitedBy": "user_object_id",
      "invitedUserId": "user_object_id",
      "invitedEmail": "jane.doe@example.com",
      "token": "hashed_token",
      "status": "pending",
      "expiresAt": "2026-05-07T02:00:00.000Z",
      "createdAt": "2026-05-06T14:00:00.000Z"
    },
    "inviteLink": "/team-invitations/a1b2c3d4e5f6.../accept"
  },
  "message": "Invitation sent successfully"
}

Notes:
- Only team leader can send invitations
- Invited user must be registered
- Invitation expires after 12 hours
- Cannot invite existing team members
- Duplicate pending invitations are prevented



## API #50: Accept Team Invitation

POST http://localhost:5000/api/team-invitations/:token/accept

Headers:
Authorization: Bearer <access_token>

Response (200):
json
{
  "statusCode": 200,
  "data": {
    "teamId": "team_object_id"
  },
  "message": "Invitation accepted successfully. You are now a team member."
}

Notes:
- Only the invited user can accept the invitation
- Expired invitations cannot be accepted
- Team size limit is checked before accepting



## API #51: Decline Team Invitation
POST http://localhost:5000/api/team-invitations/:token/decline

Headers:
Authorization: Bearer <access_token>

Response (200):
json
{
  "statusCode": 200,
  "data": {
    "message": "Invitation declined successfully"
  },
  "message": "Invitation declined successfully"
}

Notes:
- Only the invited user can decline the invitation
- Declined invitations cannot be reused