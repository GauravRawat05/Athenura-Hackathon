**Hackathon Management Platform** 

**Developer API Guide** 

*Detailed endpoint reference, input options, and implementation notes* 

Version 1.0 | **Base path: /api/v1** | Prepared for implementation handoff 

| This guide translates the project requirements into a practical REST API that developers canbuild against.  Use it as a handoff document for backend, frontend, QA, and DevOps teams.  Key design choices:  \- role-based access for participant, admin, judge, and university users  \- flexible request bodies where the same endpoint may accept more than one input shape \- public-safe routes for discovery and certificate verification  \- explicit admin namespaces for operational workflows |
| :---- |

**How to read this document** 

 Each module starts with a summary table for quick scanning. 

 Each endpoint then has a detailed breakdown of access, purpose, parameters, request body fields,  accepted input variations, and implementation notes. 

 When an endpoint accepts more than one payload shape, both options are written out explicitly so  the API contract is unambiguous. 

 This document favors clarity over brevity, so the same business rules may be restated in places where developers often get confused. 

**Role legend**

| Role  | Meaning |
| :---- | :---- |
| Public  | No login required. Safe for landing pages, public  winner pages, and certificate verification. |
| Authenticated  | Any valid logged-in user. Still requires object level access checks. |
| Participant  | A regular user joining hackathons and  submitting projects. |
| Judge  | A scoring user who only sees assigned  submissions. |
| University  | Institution dashboard user with read-only  institution views. |
| Admin  | Platform operator with event, payment, result,  and settings access. |

     **Global implementation rules** 

Use Authorization: Bearer \<access\_token\> on every non-public endpoint unless you intentionally use  an HttpOnly-cookie auth flow. 

Validate all request bodies and query strings on the server. Frontend validation is not enough.  Apply object-level access checks, not just role checks. Example: a judge must only read assigned  submissions, not all submissions. 

 Use idempotency for payment webhooks, result publication, and certificate generation jobs.  Keep public verification endpoints rate-limited and avoid exposing private data such as email or  phone number. 

 Prefer signed short-lived file URLs for certificates and submission assets. 

**1\. API foundations** 

This platform is a multi-role hackathon management backend. The API is organized by business  domain so that participants, admins, judges, and university users each get a clean and predictable  surface area. Use /api/v1 as the base prefix for all routes. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| GET  | http://localhost:3000/api/v1/health  | Public  | Service health check (Implemented) |
| GET  | http://localhost:3000/api/v1/public/hackathons  | Public  | Public hackathon listing (Not Implemented) |
| GET  | http://localhost:3000/api/v1/public/hackathons/{hackathonId}  | Public  | Public hackathon details (Not Implemented) |
| GET  | http://localhost:3000/api/v1/public/hackathons/{hackathonId}/winners  | Public  | Public winners list (Not Implemented) |
| GET  | http://localhost:3000/api/v1/public/certificates/verify/{certificateCode}  | Public  | Public certificate verification (Not Implemented) |

**GET /health** 

**Access:** Public | **Purpose:** Quick liveliness check for load balancers, monitors, and deployments. **Content-Type:** No body 

 Implementation notes: 

 Should return lightweight status only, such as uptime, version, and database reachability.  Do not expose secrets or internal topology. 

 Example response:

| {  "success": true,   "message": "Service healthy",   "data": {   "service": "hackathon-api",   "version": "1.0.0"   }  } |
| :---- |

**GET /public/hackathons** 

**Access:** Public | **Purpose:** List hackathons for landing pages and public discovery.  Query parameters: 

| Query  | Description |
| :---- | :---- |
| status  | upcoming, ongoing, or past |
| mode  | solo or team |
| fee  | free or paid |
| technologyDomain  | optional domain filter such as AI, Web,  Blockchain |
| minPrize / maxPrize  | prize pool range filtering |
| page / limit  | pagination controls |

 Implementation notes: 

 Keep this endpoint read-only and safe for public caching. 

 Use lightweight response cards here and expose fuller detail from the item endpoint. 

**2\. Authentication and session management** 

Authentication is JWT-based with a short-lived access token and a longer-lived refresh token. The  project requirements also call for email verification, password hashing, and refresh token rotation.  Keep the login system flexible enough to support either email or phone based authentication if  needed later.

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST  | http://localhost:3000/api/v1/auth/register  | Public  | Create user account |
| POST  | http://localhost:3000/api/v1/auth/verify-account  | Public  | Verify email with OTP |
| POST  | http://localhost:3000/api/v1/auth/login  | Public  | Authenticate by email or phone |
| POST  | http://localhost:3000/api/v1/auth/refresh  | Public or cookie flow  | Refresh access token |
| POST  | http://localhost:3000/api/v1/auth/logout  | Authenticated  | Logout current session |
| POST  | http://localhost:3000/api/v1/auth/forgot-password  | Public  | Initiate password reset |
| POST  | http://localhost:3000/api/v1/auth/reset-password  | Public  | Reset password with token |
| POST  | http://localhost:3000/api/v1/auth/reverify  | Public  | Resend verification email |
| GET  | http://localhost:3000/api/v1/auth/me  | Authenticated  | Get current session profile |

**POST /auth/register  \-  Nayan**

**Access:** Public | **Purpose:** Create a participant account with profile fields required by the hackathon  system. 

**Content-Type:** application/json 

 Request body fields: 

| Field | Meaning | Required |
| :---- | :---- | :---- |
| fullName | participant full name | Yes |
| email | primary login email and verification target | Yes |
| password | plain-text input that must be hashed before storage (min 6 chars, 1 uppercase, 1 special) | Yes |
| phone | optional contact number | No |
| dateOfBirth | optional date field if eligibility depends on age | No |
| collegeOrUniversity | institution label shown in dashboards | No |
| graduationYear | used for eligibility and university reporting | No |
| skills | array of strings | No |
| resumeLink | optional portfolio or resume URL | No |
| gender | "Male", "Female", or "Other" | Yes |
| secretKey | optional secret key for special registrations(admin) | No |

 Accepted input options: 

 skills can be sent as \["React", "Node.js"\] 

 skills can also be sent as "React, Node.js" and normalized on the server 

 Implementation notes: 

 Require email verification before allowing hackathon registration. 

 Normalize email to lowercase before uniqueness checks. 

 Reject weak passwords and rate limit this route. 

 Example request: 

| {  "fullName": "Aman Singh",   "email": "aman@example.com",   "password": "StrongPass@123",   "phone": "+919999999999",   "dateOfBirth": "2003-04-21",   "collegeOrUniversity": "DTU",   "graduationYear": 2027,   "skills": \["React", "Node.js", "MongoDB"\],   "resumeLink": "https://drive.google.com/file/d/abc/view"  } |
| :---- |

 Alternative request shape:

| {  "fullName": "Aman Singh",   "email": "[aman@example.com](mailto:aman@example.com)",  "password": "StrongPass@123",  "skills": "React, Node.js, MongoDB"  } |
| :---- |

**POST http://localhost:3000/api/v1/auth/verify-account**

**Access:** Public | **Purpose:** Confirm account ownership with a one-time code. **Content-Type:** application/json 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| email  | address being verified |
| otp  | time-limited one-time code |

 Example request: 

| {  "email": "aman@example.com",   "otp": "482193"  } |
| :---- |

**POST /api/v1/auth/login**

**Access:** Public | **Purpose:** Authenticate a user and return tokens plus profile basics. **Content-Type:** application/json 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| email  | email login option |
| phone  | phone login option |
| password  | password for either login type |

 

Accepted input options: 

 { email, password } 

 { phone, password } 

 Implementation notes: 

 Only one primary login identifier should be required per request. 

 Return the same generic error for bad email and bad password to avoid account enumeration.  Example request: 

| {  "email": "aman@example.com",   "password": "StrongPass@123"  } |
| :---- |

 Alternative request shape: 

| {  "phone": "+919999999999",   "password": "StrongPass@123"  } |
| :---- |

 Example response:

| {  "success": true,   "data": {      "accessToken": "jwt\_access\_token",        "refreshToken": "jwt\_refresh\_token",         "user": {         "\_id": "user\_id",         "role": "participant"          }        }  } |
| :---- |

**POST /api/v1/auth/refresh**

**Access:** Public or cookie flow | **Purpose:** Issue a new short-lived access token after validating the refresh token and implementing token rotation.

**Content-Type:** application/json or HttpOnly cookie

Request body fields:

| Field  | Meaning |
| :---- | :---- |
| refreshToken  | refresh token if not using a cookie-based flow |

Accepted input options:

body-based refresh: { refreshToken }

cookie-based refresh: no body, server reads the refresh token from an HttpOnly cookie

Implementation notes:

- **Token Rotation:** Every refresh request generates a new access token AND a new refresh token. The old refresh token is invalidated.
- **Reuse Detection:** If an old/invalid refresh token is presented, the request is rejected with 401.
- Cookie flow: Browser automatically sends `refreshToken` cookie; new tokens are set via `Set-Cookie` headers.
- Body flow: Client sends `{ refreshToken }` in request body; response contains new tokens in JSON body.

Example request (body-based):

| { "refreshToken": "refresh_token_here" } |
| :---- |

Example response:

| { "success": true, "data": { "accessToken": "new_jwt_access_token", "refreshToken": "new_jwt_refresh_token" }, "message": "Access token refreshed successfully" } |
| :---- |

Error responses:

| 401 Unauthorized | { "success": false, "message": "Invalid or expired refresh token" } |
| :---- | :---- |
| 401 Unauthorized | { "success": false, "message": "Refresh token is required" } |

**POST /api/v1/auth/logout**

**Access:** Authenticated | **Purpose:** Invalidate the current refresh token or current session family. **Content-Type:** application/json or cookie only 

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| refreshToken  | optional if refresh token is body-managed |

 Accepted input options: 

 body-based logout: { refreshToken } 

 cookie-based logout: empty body and clear the refresh cookie server-side 

**POST /auth/forgot-password** 

**Access:** Public | **Purpose:** Send a reset link or OTP to the account owner. 

**Content-Type:** application/json 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| email  | email reset option |
| phone  | phone reset option |

 

Accepted input options: 

 { email } 

 { phone } 

**POST /auth/reset-password** 

**Access:** Public | **Purpose:** Set a new password using a signed reset token. 

**Content-Type:** application/json 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| token  | reset token from email or SMS |
| newPassword  | new password to hash and store |

 Example request: 

| {  "token": "reset\_token\_here",   "newPassword": "NewStrongPass@123"  } |
| :---- |

**GET http://localhost:3000/api/v1/auth/me** 

**Access:** Authenticated | **Purpose:** Return the current session user, role, and verification state.

    
 Implementation notes: Use this route to bootstrap the frontend after page refresh. 

**3\. User profile and self-service endpoints** 

These endpoints let a participant manage their own profile and inspect their own participation  history, results, and certificates without touching admin-only data. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| GET  | http://localhost:3000/api/v1/users/me  | Authenticated  | Current profile |
| PATCH  | http://localhost:3000/api/v1/users/me  | Authenticated  | Update profile |
| GET  | http://localhost:3000/api/v1/users/me/participations  | Authenticated  | Participation history (**Not Implemented**) |
| GET  | http://localhost:3000/api/v1/users/me/results  | Authenticated  | Result history (**Not Implemented**) |
| GET  | http://localhost:3000/api/v1/users/me/certificates  | Authenticated  | Certificate list (**Not Implemented**) |

**GET http://localhost:3000/api/v1/users/me**

**Access:** Authenticated | **Purpose:** Return the profile for the logged-in user.

**PATCH http://localhost:3000/api/v1/users/me**

**Access:** Authenticated | **Purpose:** Update editable profile fields.

**Content-Type:** application/json

Request body fields (all optional, at least one required):

| Field  | Meaning |
| :---- | :---- |
| fullName  | display name (min 2, max 100 chars) |
| phone  | contact number (positive integer) |
| dateOfBirth  | optional eligibility field (date in past) |
| collegeOrUniversity  | institution name (max 200 chars) |
| graduationYear  | used for university analytics (1900 to current year + 10) |
| skills  | array of strings OR comma-separated string |
| resumeLink  | optional valid URL |

    
**GET http://localhost:3000/api/v1/users/me/participations (Not Implemented)**

**Access:** Authenticated | **Purpose:** List the current user registrations and project activity.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/users/me/results (Not Implemented)** 

**Access:** Authenticated | **Purpose:** List result records for the current user.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/users/me/certificates (Not Implemented)**

**Access:** Authenticated | **Purpose:** List available participation and rank certificates.

**Status:** This endpoint is not yet implemented in the backend.

**4\. Hackathon catalogue and admin hackathon management** 

Hackathon endpoints are split between public read routes and admin CRUD routes. Public routes  support browsing and discovery. Admin routes own event setup, rules, deadlines, prizes, and judging  criteria.

| Method  | Path  | Access  | Purpose
| :---- | :---- | :---- | :---- |
| GET  | http://localhost:3000/api/v1/hackathons  | Public  | Filterable hackathon catalogue (Not Implemented) |
| GET  | http://localhost:3000/api/v1/hackathons/{hackathonId}  | Public  | Single hackathon details (Not Implemented) |
| POST  | http://localhost:3000/api/v1/hackathons/create-hackathon  | Admin  | Create hackathon (Implemented) |
| PATCH  | http://localhost:3000/api/v1/hackathons/{hackathonId}  | Admin  | Update hackathon (Implemented) |
| DELETE  | http://localhost:3000/api/v1/hackathons/delete-hackathon/{hackathonId}  | Admin  | Delete or archive hackathon (Implemented) |
| PATCH  | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/rules  | Admin  | Update rules only (Not Implemented) |
| PATCH  | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/rubric  | Admin  | Update judging criteria (Not Implemented) |

**GET http://localhost:3000/api/v1/hackathons (Not Implemented)**

**Access:** Public | **Purpose:** List hackathons with discovery filters.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/hackathons/{hackathonId} (Not Implemented)** 

**Access:** Public | **Purpose:** Return full hackathon details for registration pages.

**Status:** This endpoint is not yet implemented in the backend.

**POST http://localhost:3000/api/v1/hackathons/create-hackathon (Implemented)**

**Access:** Admin | **Purpose:** Create a new hackathon with rules, rubric, pricing, and timeline. **Content-Type:** application/json

**Status:** Implemented in the backend.

Request body fields:

| Field  | Meaning | Required |
| :---- | :---- | :---- |
| title  | event name | Yes |
| slug  | URL-friendly event key | Yes |
| description  | full public description | Yes |
| mode  | array: can include "Solo", "Both" | No |
| allowedModes  | normalized array of mode strings | No |
| startDate  | event start timestamp | Yes |
| endDate  | event end timestamp (must be after startDate) | Yes |
| registrationDeadline  | last registration timestamp (must be before startDate) | Yes |
| submissionDeadline  | last submission timestamp (between startDate and endDate) | Yes |
| prizePool  | total prizes amount | Yes |
| registrationFee  | fee amount | Yes |
| currency  | "INR" or "DOLLAR" | Yes |
| minTeamSize  | minimum team members | Yes |
| maxTeamSize  | maximum team members (must be > minTeamSize) | No |
| technologyDomains  | array of tags for discovery | Yes |
| rules  | array of rule strings | Yes |
| judgingCriteria  | array of { name, weight } objects | No |
| eligibility  | array of strings OR object with studentOnly, allowedGraduationYears | Yes |
| sponsors  | array of { name, logoUrl } objects | No |

 Accepted input options:

 Use mode="both" if you prefer one enum field

 Use allowedModes=["solo", "team"] if you prefer a normalized array

 Example request:

| {  "title": "Hack the Future 2026",   "slug": "hack-the-future-2026",   "description": "National hackathon for web and AI projects",   "allowedModes": ["solo", "team"],   "startDate": "2026-07-15T09:00:00.000Z",   "endDate": "2026-07-17T18:00:00.000Z",   "registrationDeadline": "2026-07-10T23:59:59.000Z",   "submissionDeadline": "2026-07-17T16:00:00.000Z",   "prizePool": 250000,   "registrationFee": 499,   "currency": "INR",   "minTeamSize": 2,   "maxTeamSize": 4,   "technologyDomains": ["AI", "Web", "Blockchain"],   "rules": ["Original work only", "No plagiarism"],   "judgingCriteria": [   { "name": "Innovation", "weight": 30 },   { "name": "Technical Complexity", "weight": 30 },   { "name": "Presentation", "weight": 20 },   { "name": "Impact", "weight": 20 }   ]  } |
| :---- |

**PATCH http://localhost:3000/api/v1/hackathons/{hackathonId} (Implemented)**

**Access:** Admin | **Purpose:** Update any subset of mutable hackathon fields.

**Status:** Implemented in the backend.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

Request body fields: All fields from create are optional here. Same validation rules apply.

Implementation notes:

Treat this as a partial update endpoint.

Revalidate timeline consistency after every change.

**DELETE http://localhost:3000/api/v1/hackathons/delete-hackathon/{hackathonId} (Implemented)**

**Access:** Admin | **Purpose:** Delete or soft-delete a hackathon.

**Status:** Implemented in the backend.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

Implementation notes:
Soft delete is usually safer than hard delete because payments, submissions, and certificates may already exist.

**Access:** Admin | **Purpose:** Delete or soft-delete a hackathon.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

Implementation notes:
Soft delete is usually safer than hard delete because payments, submissions, and certificates may already exist.

**PATCH http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/rules (Not Implemented)**

**Access:** Admin | **Purpose:** Replace the rule list only.

**Status:** This endpoint is not yet implemented in the backend.

**PATCH http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/rubric (Not Implemented)** 

**Access:** Admin | **Purpose:** Replace judging criteria or change tie-break behavior.  Request body fields:

| Field  | Meaning |
| :---- | :---- |
| judgingCriteria  | array of weighted rubric criteria |

| Field  | Meaning |
| :---- | :---- |
| tieBreakerRule  | earlier\_submission, judge\_preference, or  manual\_override |

 Accepted input options: 

 Tie-break rule can be stored as an enum string 

 If you need richer logic later, tie-break can evolve into a policy object 

**5\. Teams and invitations** 

Team mode supports team creation, invitations, acceptance, decline, and member removal. The key design rule is that a team can be built from both known platform users and invited emails that may not have accounts yet. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST  | http://localhost:3000/api/v1/teams/hackathons/{hackathonId}/teams  | Authenticated  | Create a team inside a hackathon |
| GET  | http://localhost:3000/api/v1/teams/{teamId}  | Authenticated  | Get team details |
| PATCH  | http://localhost:3000/api/v1/teams/{teamId}  | Authenticated (Leader only)  | Update team metadata |
| POST  | http://localhost:3000/api/v1/teams/{teamId}/invitations  | Authenticated (Leader only)  | Invite a member by email |
| POST  | http://localhost:3000/api/v1/teams/team-invitations/{token}/accept  | Authenticated  | Accept invite |
| POST  | http://localhost:3000/api/v1/teams/team-invitations/{token}/decline  | Authenticated  | Decline invite |
| DELETE  | http://localhost:3000/api/v1/teams/{teamId}/members/{userId}  | Authenticated (Leader only)  | Remove a member |

**POST http://localhost:3000/api/v1/teams/hackathons/{hackathonId}/teams**

**Access:** Authenticated | **Purpose:** Create a team record for a team-mode hackathon. Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

Request body fields:

| Field  | Meaning | Required |
| :---- | :---- | :---- |
| teamName  | unique per hackathon (min 3, max 50 chars) | Yes |
| description  | team description (max 500 chars) | No |

**Note:** Members are invited separately using the invitations endpoint. The current authenticated user becomes the team leader by default.

Example request:

| {  "teamName": "CodeStorm",  "description": "A team of passionate developers" } |
| :---- |

**GET http://localhost:3000/api/v1/teams/{teamId}**

**Access:** Authenticated | **Purpose:** Return team name, leader, members, pending invites, and state.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| teamId  | team identifier |

**PATCH http://localhost:3000/api/v1/teams/{teamId}**

**Access:** Authenticated (Team Leader only) | **Purpose:** Update team metadata such as display name or leader.

Request body fields (at least one required):

| Field  | Meaning |
| :---- | :---- |
| teamName  | new unique team name (min 3, max 50 chars) |
| description  | team description (max 500 chars) |
| leader  | new leader user ID (24-char hex ObjectId) |

**POST http://localhost:3000/api/v1/teams/{teamId}/invitations**

**Access:** Authenticated (Team Leader only) | **Purpose:** Invite a user to the team by email.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| teamId  | team identifier |

Request body fields:

| Field  | Meaning | Required |
| :---- | :---- | :---- |
| email  | email address of user to invite | Yes |

**Note:** Backend currently supports single email invites only. Bulk invites not yet implemented.

Implementation notes:

Sign every invite token and add expiry.

Do not reveal whether an invited email already exists in the system. 

**POST http://localhost:3000/api/v1/teams/team-invitations/{token}/accept**

**Access:** Authenticated | **Purpose:** Accept a team invitation and attach the user to the team.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| token  | signed invite token | 

        **POST http://localhost:3000/api/v1/teams/team-invitations/{token}/decline**

**Access:** Authenticated | **Purpose:** Decline a team invitation.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| token  | signed invite token |

**DELETE http://localhost:3000/api/v1/teams/{teamId}/members/{userId}** 

**Access:** Authenticated (Team Leader only) | **Purpose:** Remove a member from a team.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| teamId  | team identifier |
| userId  | member to remove (24-char hex ObjectId) |

Implementation notes:

Restricted to team leader only. Cannot remove yourself (use leave team endpoint instead if implemented). 

**6\. Registrations** 

Registration endpoints are where participant intent becomes an event enrollment. The backend must  enforce deadlines, single registration rules, team-size rules, and payment prerequisites. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/hackathons/{hackathonId}/register/solo | Authenticated  | Register as a solo participant (**Not Implemented**) |
| POST | http://localhost:3000/api/v1/hackathons/{hackathonId}/register/team | Authenticated  | Register a team (**Not Implemented**) |
| GET | http://localhost:3000/api/v1/registrations/me | Authenticated  | Current user registrations (**Not Implemented**) |
| GET | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/registrations | Admin  | Registration list for one hackathon (**Not Implemented**) |
| PATCH | http://localhost:3000/api/v1/registrations/{registrationId}/cancel | Authenticated  | Cancel registration (**Not Implemented**) |

**POST http://localhost:3000/api/v1/hackathons/{hackathonId}/register/solo (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Register the current user in solo mode.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

  17   
 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| userId  | optional if the authenticated user is implied |
| paymentMethod  | razorpay or stripe when fee \> 0 |
| notes  | optional participant notes |

 Implementation notes: 

 Reject if the registration deadline has passed. 

 Reject duplicate solo registration for the same user and hackathon. 

 Example request: 

| {  "userId": "current\_user\_id",   "paymentMethod": "razorpay",   "notes": "Interested in AI track"  } |
| :---- |

 Alternative request shape: 

| {  "userId": "current\_user\_id"  } |
| :---- |

**POST http://localhost:3000/api/v1/hackathons/{hackathonId}/register/team (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Register a team-mode entry.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| teamId  | register an already-created team |
| team | create-and-register payload for teams created  inline |
| paymentMethod  | razorpay or stripe when fee \> 0 |

 Accepted input options: 

 { teamId, paymentMethod } when the team already exists

  18   
 { team: { teamName, members }, paymentMethod } when you want a create-and-register flow  Example request: 

| {  "teamId": "team\_id",   "paymentMethod": "razorpay"  } |
| :---- |

 Alternative request shape: 

| {  "team": {   "teamName": "CodeStorm",   "members": \[   { "email": "a@example.com" },   { "email": "b@example.com" }   \]   },   "paymentMethod": "razorpay"  } |
| :---- |

**GET http://localhost:3000/api/v1/registrations/me (Not Implemented)** 

**Access:** Authenticated | **Purpose:** List the current user registrations.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| status  | pending, confirmed, or cancelled |
| hackathonId  | optional single-event filter |

**GET http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/registrations (Not Implemented)** 

**Access:** Admin | **Purpose:** List registrations for an event with operational filters.

**Status:** This endpoint is not yet implemented in the backend.  Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Query parameters:

| Query  | Description |
| :---- | :---- |
| mode  | solo or team |
| paymentStatus  | pending, completed, failed, refunded |
| search  | name or email search |
| page / limit  | pagination controls |

  19   
**PATCH http://localhost:3000/api/v1/registrations/{registrationId}/cancel (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Cancel a registration and optionally request refund workflow.

**Status:** This endpoint is not yet implemented in the backend.  Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| registrationId  | registration identifier |

 

Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| reason  | human-readable cancellation reason |
| requestedRefund  | true if refund should be initiated or reviewed |

 Example request: 

| {  "reason": "Cannot participate",   "requestedRefund": true  } |
| :---- |

**7\. Payments and webhook handling** 

Payments cover order creation, client-side verification, status checks, refunds, and webhook  ingestion. Never trust only the frontend payment callback. The final source of truth should come from verified server-side gateway data.

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/payments/create-order | Authenticated | Create payment order (Not Implemented) |
| POST | http://localhost:3000/api/v1/payments/verify | Authenticated | Verify client-side payment callback (Not Implemented) |
| GET | http://localhost:3000/api/v1/payments/{paymentId}/status | Authenticated | Get payment status (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/payments | Admin | List all payments (Implemented) |
| GET | http://localhost:3000/api/v1/admin/payments/{paymentId} | Admin | Get payment details (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/payments/{paymentId} | Admin | Update payment status (Implemented) |
| POST | http://localhost:3000/api/v1/admin/payments/{paymentId}/refund | Admin | Refund payment (Implemented) |
| GET | http://localhost:3000/api/v1/admin/payments/stats | Admin | Get payment statistics (Implemented) |
| POST | http://localhost:3000/api/v1/payments/webhooks/razorpay | Public gateway | Ingest Razorpay webhook (Not Implemented) |
| POST | http://localhost:3000/api/v1/payments/webhooks/stripe | Public gateway | Ingest Stripe webhook (Not Implemented) |

  20   
**POST http://localhost:3000/api/v1/payments/create-order (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Create a gateway order before actual checkout.

**Status:** This endpoint is not yet implemented in the backend.  Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| hackathonId  | event being paid for |
| registrationId  | registration awaiting payment |
| teamId  | optional alternative if you pay at team level |
| gateway  | razorpay or stripe |
| amount  | numeric amount |
| currency  | currency code such as INR |

 Accepted input options: 

 Some flows pay against a registrationId 

 Some flows can pay against a teamId if the registration record is created after payment 

**POST http://localhost:3000/api/v1/payments/verify (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Verify client-side payment completion.

**Status:** This endpoint is not yet implemented in the backend. 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| gateway  | razorpay or stripe |
| razorpay\_order\_id  | Razorpay only |
| razorpay\_payment\_id  | Razorpay only |
| razorpay\_signature  | Razorpay signature |
| paymentIntentId  | Stripe only |
| clientSecret  | Stripe client secret if used |

 Accepted input options: 

 Razorpay shape: { gateway, razorpay\_order\_id, razorpay\_payment\_id, razorpay\_signature }  Stripe shape: { gateway, paymentIntentId, clientSecret } 

 Implementation notes: 

 This endpoint is helpful, but webhook verification should still finalize payment state.  Make every payment update idempotent. 

 Example request:

| {  "gateway": "razorpay",   "razorpay\_order\_id": "order\_123", |
| :---- |

  21 

|  "razorpay\_payment\_id": "pay\_123",  "razorpay\_signature": "signature\_here"  } |
| :---- |

 Alternative request shape: 

| {  "gateway": "stripe",   "paymentIntentId": "pi\_123",   "clientSecret": "secret\_here"  } |
| :---- |

**GET http://localhost:3000/api/v1/payments/{paymentId}/status (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Return the current payment state.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| paymentId  | payment identifier |

**GET http://localhost:3000/api/v1/admin/payments (Implemented)**

**Access:** Admin | **Purpose:** List all payments with optional filters.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/payments/{paymentId} (Implemented)**

**Access:** Admin | **Purpose:** Get detailed payment information.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| paymentId | Payment identifier (24-char hex ObjectId) |

**PATCH http://localhost:3000/api/v1/admin/payments/{paymentId} (Implemented)**

**Access:** Admin | **Purpose:** Update payment status and details.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| paymentId | Payment identifier (24-char hex ObjectId) |

Request body fields (optional):

| Field | Meaning |
| :---- | :---- |
| status | "pending", "completed", "failed", or "refunded" |
| method | payment method string (max 50 chars) |
| transactionId | transaction reference (max 100 chars) |
| amount | numeric amount (min 0) |
| currency | 3-letter currency code |

**POST http://localhost:3000/api/v1/admin/payments/{paymentId}/refund (Implemented)**

**Access:** Admin | **Purpose:** Initiate full or partial refund.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| paymentId | Payment identifier (24-char hex ObjectId) |

Request body fields (optional):

| Field | Meaning |
| :---- | :---- |
| amount | partial refund amount (if omitted, full refund) |
| reason | refund reason (max 500 chars) |

**GET http://localhost:3000/api/v1/admin/payments/stats (Implemented)**

**Access:** Admin | **Purpose:** Get payment statistics and analytics.

**Status:** Implemented in the backend.

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| paymentId  | payment identifier |

 

Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| reason  | why the refund is being issued |
| amount  | optional partial refund amount |

 Accepted input options: 

 Full refund by omitting amount 

 Partial refund by including amount 

**POST http://localhost:3000/api/v1/payments/webhooks/razorpay (Not Implemented)** 

**Access:** Public gateway | **Purpose:** Receive Razorpay payment events.

**Status:** This endpoint is not yet implemented in the backend.

  22   
**Content-Type:** raw body plus X-Razorpay-Signature header 

 Implementation notes: 

 Validate the signature against the raw request body. 

 Store the gateway event id to prevent replay processing. 

**POST http://localhost:3000/api/v1/payments/webhooks/stripe (Not Implemented)** 

**Access:** Public gateway | **Purpose:** Receive Stripe payment events.

**Status:** This endpoint is not yet implemented in the backend. 

**Content-Type:** raw body plus Stripe-Signature header 

 Implementation notes: 

 Validate webhook signatures using the endpoint secret. 

 Do not JSON-parse the body before signature verification if the library requires raw bytes. 

**8\. Project submissions** 

Submissions are versioned project entries attached to a registration. The system should allow repo  links, live demos, video demos, images, and notes, while enforcing submission deadlines and preserving history. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/submissions/hackathons/{hackathonId}/submissions | Authenticated | Create submission (Implemented) |
| PATCH | http://localhost:3000/api/v1/submissions/{submissionId} | Authenticated | Update submission (Implemented) |
| POST | http://localhost:3000/api/v1/submissions/{submissionId}/assets | Authenticated | Upload or attach assets (Implemented) |
| GET | http://localhost:3000/api/v1/submissions/hackathons/{hackathonId}/submissions/me | Authenticated | Current user submission(s) (Implemented) |
| GET | http://localhost:3000/api/v1/submissions/{submissionId}/versions | Authenticated | Version history (Implemented) |

**POST http://localhost:3000/api/v1/submissions/hackathons/{hackathonId}/submissions (Implemented)**

**Access:** Authenticated | **Purpose:** Create a project submission for a registered participant or team. **Content-Type:** application/json or multipart/form-data

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| registrationId  | registration that owns the submission |
| repositoryUrl  | code repository URL |
| liveDemoUrl  | live demo URL |
| videoDemoUrl  | demo video URL |
| imageUrls  | array of already-uploaded asset URLs |
| additionalNotes  | notes for judges |

 Accepted input options:

 Pure JSON when image assets already exist as URLs

 Multipart form-data when images are uploaded directly in the request

 Implementation notes:

 Reject new submissions after the submission deadline.

 If multiple submissions are allowed, store them as versioned records instead of destructive  overwrites.

 Example request:

| {  "registrationId": "registration\_id",   "repositoryUrl": "https://github.com/team/project",   "liveDemoUrl": "https://project.vercel.app",   "videoDemoUrl": "https://youtube.com/watch?v=abc",   "imageUrls": \[   "https://res.cloudinary.com/.../1.png",   "https://res.cloudinary.com/.../2.png"   \],   "additionalNotes": "Built with MERN and OpenAI API"  } |
| :---- |

**PATCH http://localhost:3000/api/v1/submissions/{submissionId} (Implemented)**

**Access:** Authenticated | **Purpose:** Update an existing submission or create a new version.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| submissionId  | submission identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| repositoryUrl  | updated repository URL |
| liveDemoUrl  | updated live demo URL |
| videoDemoUrl  | updated video URL |
| additionalNotes  | updated judge notes |

**POST http://localhost:3000/api/v1/submissions/{submissionId}/assets (Implemented)**

**Access:** Authenticated | **Purpose:** Add images or external asset URLs to an existing submission.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| submissionId  | submission identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| imageUrls  | array of externally stored image URLs |
| images[]  | actual file upload field if using multipart |

 Accepted input options:

 JSON with imageUrls

 Multipart with images[] files

**GET http://localhost:3000/api/v1/submissions/hackathons/{hackathonId}/submissions/me (Implemented)**

**Access:** Authenticated | **Purpose:** Return the current user or team submission(s) for an event.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

**GET http://localhost:3000/api/v1/submissions/{submissionId}/versions (Implemented)**

**Access:** Authenticated | **Purpose:** Show all saved versions of the same project submission.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| submissionId  | submission identifier |



**9\. Judging and scoring** 

Judging endpoints support judge assignment, judge-specific submission views, rubric scoring, and  updates. Judges should only ever see submissions explicitly assigned to them. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/judges/assign | Admin | Assign judges (Implemented) |
| GET | http://localhost:3000/api/v1/judge/assignments | Judge | Judge assignment list (Implemented) |
| GET | http://localhost:3000/api/v1/judge/hackathons/{hackathonId}/submissions | Judge | Judge-visible submissions (Implemented) |
| POST | http://localhost:3000/api/v1/judge/submissions/{submissionId}/scores | Judge | Create score (Implemented) |
| PATCH | http://localhost:3000/api/v1/judge/scores/{scoreId} | Judge | Update score (Implemented) |

**POST http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/judges/assign (Implemented)**

**Access:** Admin | **Purpose:** Assign judges to an event.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| judgeId  | single judge assignment |
| judgeIds  | bulk judge assignment array |

 Accepted input options:

 { judgeId } for one judge

 { judgeIds: [ ... ] } for bulk assignment

**GET http://localhost:3000/api/v1/judge/assignments (Implemented)**

**Access:** Judge | **Purpose:** Return the current judge's event assignments.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/judge/hackathons/{hackathonId}/submissions (Implemented)**

**Access:** Judge | **Purpose:** List only submissions assigned to the current judge.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Query parameters:

| Query  | Description |
| :---- | :---- |
| status  | pending or scored |
| page / limit  | pagination controls |

 Implementation notes:

 Never expose all submissions and then filter on the frontend.

 This is a classic object-level authorization risk area.

**POST http://localhost:3000/api/v1/judge/submissions/{submissionId}/scores (Implemented)**

**Access:** Judge | **Purpose:** Create a rubric-based score record for a submission.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| submissionId  | submission identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| criteriaScores  | either a criterion map or an array of criterion score pairs |
| comments  | optional written feedback |

 Accepted input options:

 Object map shape, for example { innovation: 8, impact: 7 }

 Array shape, for example [{ criterion: "Innovation", score: 8 }]

 Example request:

| {  "criteriaScores": {   "innovation": 8,   "technical\_complexity": 9,   "presentation": 7,   "impact": 8   },   "comments": "Strong product-market fit"  } |
| :---- |

 Alternative request shape:

| {  "criteriaScores": \[   { "criterion": "Innovation", "score": 8 },   { "criterion": "Technical Complexity", "score": 9 },   { "criterion": "Presentation", "score": 7 },   { "criterion": "Impact", "score": 8 }   \],   "comments": "Strong product-market fit"  } |
| :---- |

**PATCH http://localhost:3000/api/v1/judge/scores/{scoreId} (Implemented)**

**Access:** Judge | **Purpose:** Update a previously submitted score.

**Status:** Implemented in the backend.

 Path parameters:

| Parameter  | Description |
| :---- | :---- |
| scoreId  | score identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| criteriaScores  | partial or full revised scores |
| comments  | updated comments |

**10\. Results and rankings** 

Results are computed from weighted scores, adjusted by tie-break rules, optionally overridden by  administrators, and finally published to participants and public winner pages.

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/results/compute | Admin | Aggregate scores and compute ranks (Not Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/results/override | Admin | Override ranks or awards (Not Implemented) |
| POST | http://localhost:3000/api/v1/admin/results/publish/{hackathonId} | Admin | Publish results (Implemented) |
| GET | http://localhost:3000/api/v1/hackathons/{hackathonId}/winners | Public | Winners list (Not Implemented) |
| GET | http://localhost:3000/api/v1/hackathons/{hackathonId}/results | Authenticated | Result view (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/results | Admin | List all results (Implemented) |
| GET | http://localhost:3000/api/v1/admin/results/{resultId} | Admin | Get result details (Implemented) |
| POST | http://localhost:3000/api/v1/admin/results | Admin | Create a result (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/results/{resultId} | Admin | Update a result (Implemented) |
| GET | http://localhost:3000/api/v1/admin/results/hackathon/{hackathonId} | Admin | Get hackathon results (Implemented) |

**POST http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/results/compute (Not Implemented)** 

**Access:** Admin | **Purpose:** Compute weighted scores and ranks.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| tieBreakerRule  | earlier\_submission, judge\_preference, or  manual\_override |

Accepted input options: 

 Simple enum string 

 A richer policy object later if tie-break logic grows 

**PATCH http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/results/override (Not Implemented)** 

**Access:** Admin | **Purpose:** Override final ranks or attach special awards.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| overrides  | array of explicit rank overrides |

  29 

| Field  | Meaning |
| :---- | :---- |
| specialAwards  | array of award objects |

 Accepted input options: 

 Rank override shape with submissionId, finalRank, and reason 

 Special award shape with submissionId and award name 

 Implementation notes: 

 Keep original judge scores immutable and store overrides separately for auditability.  Example request: 

| {  "overrides": \[   {   "submissionId": "sub\_1",   "finalRank": 1,   "reason": "Tie resolved by panel discussion"   }   \]  } |
| :---- |

 Alternative request shape: 

| {  "specialAwards": \[   {   "submissionId": "sub\_2",   "award": "Best UI/UX"   }   \]  } |
| :---- |

**POST http://localhost:3000/api/v1/admin/results/publish/{hackathonId} (Implemented)**

**Access:** Admin | **Purpose:** Finalize and publish results to dashboards and notifications.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| hackathonId | Hackathon identifier (24-char hex ObjectId) |

Request body fields:

| Field | Meaning |
| :---- | :---- |
| winnerCount | number of top winners |
| runnerUpCount | number of runner-up slots |
| specialAwards | list of special award labels |
| notifyParticipants | whether to trigger notifications |

**GET http://localhost:3000/api/v1/hackathons/{hackathonId}/winners (Not Implemented)**

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| winnerCount  | number of top winners |
| runnerUpCount  | number of runner-up slots |

  30 

| Field  | Meaning |
| :---- | :---- |
| specialAwards  | list of special award labels |
| notifyParticipants  | whether to trigger notifications |

 Example request: 

| {  "winnerCount": 3,   "runnerUpCount": 2,   "specialAwards": \["Best Innovation", "Best Social Impact"\],   "notifyParticipants": true  } |
| :---- |

**GET /hackathons/{hackathonId}/winners** 

**Access:** Public | **Purpose:** Return public winner cards for the event.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

**GET http://localhost:3000/api/v1/hackathons/{hackathonId}/results (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Return result records for an event.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/admin/results (Implemented)**

**Access:** Admin | **Purpose:** List all results with filters.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/results/{resultId} (Implemented)**

**Access:** Admin | **Purpose:** Get detailed result information.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| resultId | Result identifier (24-char hex ObjectId) |

**POST http://localhost:3000/api/v1/admin/results (Implemented)**

**Access:** Admin | **Purpose:** Create a new result record.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| submissionId | Submission identifier (24-char hex) | Yes |
| hackathonId | Hackathon identifier (24-char hex) | Yes |
| rank | Final rank position (min 1) | Yes |
| score | Numeric score (0-100) | Yes |
| awardCategory | "winner", "finalist", or "participant" | No |
| remarks | Additional remarks (max 500 chars) | No |

**PATCH http://localhost:3000/api/v1/admin/results/{resultId} (Implemented)**

**Access:** Admin | **Purpose:** Update an existing result.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| resultId | Result identifier (24-char hex ObjectId) |

Request body fields (all optional):

| Field | Meaning |
| :---- | :---- |
| rank | Final rank position |
| score | Numeric score (0-100) |
| awardCategory | "winner", "finalist", or "participant" |
| remarks | Additional remarks (max 500 chars) |

**GET http://localhost:3000/api/v1/admin/results/hackathon/{hackathonId} (Implemented)**

**Access:** Admin | **Purpose:** Get all results for a specific hackathon.

**Status:** Implemented in the backend.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

Query parameters:

| Query  | Description |
| :---- | :---- |
| mine  | true to emphasize the current user or team |

**11\. Certificates** 

Certificates include participation certificates for all eligible participants and rank certificates for  winners. Downloads should be short-lived and signed. Verification should be public and safe for  external sharing.

  31 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/certificates/generate | Admin | Generate certificates (Not Implemented) |
| GET | http://localhost:3000/api/v1/users/me/certificates | Authenticated | Current user certificates (Not Implemented) |
| GET | http://localhost:3000/api/v1/certificates/{certificateId}/download | Authenticated | Get signed download URL (Not Implemented) |
| GET | http://localhost:3000/api/v1/certificates/verify/{certificateCode} | Public | Verify certificate (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/certificates | Admin | List all certificates (Implemented) |
| GET | http://localhost:3000/api/v1/admin/certificates/{certificateId} | Admin | Get certificate details (Implemented) |
| POST | http://localhost:3000/api/v1/admin/certificates | Admin | Issue a certificate (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/certificates/{certificateId} | Admin | Update certificate (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/certificates/{certificateId}/revoke | Admin | Revoke certificate (Implemented) |
| POST | http://localhost:3000/api/v1/admin/certificates/{certificateId}/resend-email | Admin | Resend certificate email (Implemented) |

**POST http://localhost:3000/api/v1/admin/hackathons/{hackathonId}/certificates/generate (Not Implemented)** 

**Access:** Admin | **Purpose:** Generate participation and or rank certificates.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| hackathonId  | target event identifier |

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| type  | all, participation, or rank |
| userIds  | optional targeted generation list |

 Accepted input options: 

 Generate for all eligible users with { type: "all" } 

 Generate a specific certificate type only 

 Generate for a selected subset using userIds\[\] 


  32   
**GET http://localhost:3000/api/v1/certificates/{certificateId}/download (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Return a signed, short-lived download URL.

**Status:** This endpoint is not yet implemented in the backend.  Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| certificateId  | certificate identifier |

 Implementation notes: 

 Do not expose permanent public file URLs. 

 Track download counts if analytics need them. 

 Example response: 

| {  "downloadUrl": "https://signed-url...",   "expiresAt": "2026-04-23T18:30:00.000Z"  } |
| :---- |

**GET http://localhost:3000/api/v1/certificates/verify/{certificateCode} (Not Implemented)** 

**Access:** Public | **Purpose:** Validate a certificate ID or QR payload.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/admin/certificates (Implemented)**

**Access:** Admin | **Purpose:** List all certificates with filters.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/certificates/{certificateId} (Implemented)**

**Access:** Admin | **Purpose:** Get detailed certificate information.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| certificateId | Certificate identifier (24-char hex ObjectId) |

**POST http://localhost:3000/api/v1/admin/certificates (Implemented)**

**Access:** Admin | **Purpose:** Issue a new certificate.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| userId | User identifier (24-char hex ObjectId) | Yes |
| hackathonId | Hackathon identifier (24-char hex ObjectId) | Yes |
| certificateType | "participation", "winner", "finalist", or "judge" | Yes |
| awardCategory | Award category description | No |

**PATCH http://localhost:3000/api/v1/admin/certificates/{certificateId} (Implemented)**

**Access:** Admin | **Purpose:** Update certificate details.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| certificateId | Certificate identifier (24-char hex ObjectId) |

Request body fields:

| Field | Meaning |
| :---- | :---- |
| awardCategory | Award category description |
| remarks | Additional remarks (max 500 chars) |

**PATCH http://localhost:3000/api/v1/admin/certificates/{certificateId}/revoke (Implemented)**

**Access:** Admin | **Purpose:** Revoke a certificate.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| certificateId | Certificate identifier (24-char hex ObjectId) |

**POST http://localhost:3000/api/v1/admin/certificates/{certificateId}/resend-email (Implemented)**

**Access:** Admin | **Purpose:** Resend certificate email to recipient.

**Status:** Implemented in the backend.

Path parameters:

| Parameter  | Description |
| :---- | :---- |
| certificateId  | certificate identifier |

Implementation notes:

 Use a non-sequential random code to avoid enumeration.

 Rate limit this endpoint because it is public.

 Example response:

| {  "valid": true,   "participantName": "Aman Singh",   "hackathonName": "Hack the Future 2026",   "certificateType": "Rank",   "rank": 1,   "issuedAt": "2026-07-20T10:00:00.000Z"  } |
| :---- |

  33 

**12\. University dashboards** 

University dashboards are institution-scoped read surfaces. Admins create university records and domain mappings. University admins then inspect students, performance, and export reports, but do not modify hackathons. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/admin/universities | Admin | Create university (Implemented) |
| GET | http://localhost:3000/api/v1/admin/universities | Admin | List universities (Implemented) |
| GET | http://localhost:3000/api/v1/admin/universities/{universityId} | Admin | Get university details (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/universities/{universityId} | Admin | Update university (Implemented) |
| DELETE | http://localhost:3000/api/v1/admin/universities/{universityId} | Admin | Delete university (Implemented) |
| GET | http://localhost:3000/api/v1/admin/universities/{universityId}/stats | Admin | Get university statistics (Implemented) |
| GET | http://localhost:3000/api/v1/university/me | University | Dashboard overview (Not Implemented) |
| GET | http://localhost:3000/api/v1/university/me/students | University | Student list (Not Implemented) |
| GET | http://localhost:3000/api/v1/university/me/analytics | University | Institution analytics (Not Implemented) |
| GET | http://localhost:3000/api/v1/university/me/reports/export | University | Export reports (Not Implemented) |

**POST http://localhost:3000/api/v1/admin/universities (Implemented)**

**Access:** Admin | **Purpose:** Create a university record.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| name | Institution name (min 3, max 200 chars) | Yes |
| code | University code (min 2, max 10 chars, uppercase) | Yes |
| email | Contact email | Yes |
| phone | Contact phone (min 10, max 15 chars) | No |
| location | Address/location (max 200 chars) | No |
| state | State (max 100 chars) | No |
| country | Country (max 100 chars) | No |
| website | Valid URL | No |

 Example request:

| {  "name": "Delhi Technological University",   "emailDomain": "dtu.ac.in",   "contactEmail": "placement@dtu.ac.in",   "temporaryPassword": "TempPass@123"  } |
| :---- |

**GET http://localhost:3000/api/v1/admin/universities (Implemented)**

**Access:** Admin | **Purpose:** List all universities with filters.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/universities/{universityId} (Implemented)**

**Access:** Admin | **Purpose:** Get detailed university information.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| universityId | University identifier (24-char hex ObjectId) |

**PATCH http://localhost:3000/api/v1/admin/universities/{universityId} (Implemented)**

**Access:** Admin | **Purpose:** Update university metadata.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| universityId | University identifier (24-char hex ObjectId) |

Request body fields (all optional):

| Field | Meaning |
| :---- | :---- |
| name | Institution name (min 3, max 200 chars) |
| code | University code (min 2, max 10 chars, uppercase) |
| email | Contact email |
| phone | Contact phone (min 10, max 15 chars) |
| location | Address/location (max 200 chars) |
| state | State (max 100 chars) |
| country | Country (max 100 chars) |
| website | Valid URL |
| status | "active" or "inactive" |

**DELETE http://localhost:3000/api/v1/admin/universities/{universityId} (Implemented)**

**Access:** Admin | **Purpose:** Delete a university.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| universityId | University identifier (24-char hex ObjectId) |

Path parameters:

| Parameter | Description |
| :---- | :---- |
| universityId | University identifier (24-char hex ObjectId) |

**GET http://localhost:3000/api/v1/admin/universities/{universityId}/stats (Implemented)**

**Access:** Admin | **Purpose:** Get university statistics and analytics.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| universityId | University identifier (24-char hex ObjectId) |

**GET http://localhost:3000/api/v1/university/me (Not Implemented)**

**GET /university/me** 

**Access:** University | **Purpose:** Return the overview dashboard for the current institution.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/university/me/students (Not Implemented)** 

**GET /university/me/students** 

**Access:** University | **Purpose:** List institution-linked students with participation context.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/university/me/analytics (Not Implemented)**  Query parameters: 

| Query  | Description |
| :---- | :---- |
| hackathonId  | optional event filter |
| bestRankLte  | show only students at or above a rank threshold |
| search  | name or email search |
| page / limit  | pagination controls |

**GET /university/me/analytics** 

**Access:** University | **Purpose:** Return participation and performance metrics.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/university/me/reports/export (Not Implemented)**  Query parameters: 

| Query  | Description |
| :---- | :---- |
| from / to  | optional date window |

**GET /university/me/reports/export** 

**Access:** University | **Purpose:** Export a university report.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters:

| Query  | Description |
| :---- | :---- |
| format  | csv or pdf |
| type  | participation, ranking, or summary |

  35 

| Query  | Description |
| :---- | :---- |
| hackathonId  | optional event filter |

**13\. Admin user management and platform settings** 

Admin endpoints provide user oversight, account suspension, password reset assistance, and  configuration for payment and email systems. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| POST | http://localhost:3000/api/v1/admin/auth/register | Admin | Register new admin (Implemented) |
| POST | http://localhost:3000/api/v1/admin/auth/login | Public | Admin login (Implemented) |
| GET | http://localhost:3000/api/v1/admin/users | Admin | List users (Implemented) |
| GET | http://localhost:3000/api/v1/admin/users/{userId} | Admin | User details (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/users/{userId}/suspend | Admin | Suspend user (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/users/{userId}/restore | Admin | Restore user (Implemented) |
| POST | http://localhost:3000/api/v1/admin/users/{userId}/resetpassword | Admin | Reset user password (Implemented) |
| GET | http://localhost:3000/api/v1/admin/settings | Admin | Get settings (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/settings/payment | Admin | Update payment configuration (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/settings/email-templates/{templateKey} | Admin | Update email template (Not Implemented) |

**POST http://localhost:3000/api/v1/admin/auth/login (Implemented)**

**Access:** Public | **Purpose:** Authenticate an admin user.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| email | Admin email address | Yes |
| password | Password | Yes |

**POST http://localhost:3000/api/v1/admin/auth/register (Implemented)**

**Access:** Public (with admin secret key) | **Purpose:** Register a new admin account.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| email | Admin email address | Yes |
| password | Password (min 8 chars) | Yes |
| confirmPassword | Must match password | Yes |
| adminSecretKey | Secret key for admin registration | Yes |

**GET http://localhost:3000/api/v1/admin/users (Implemented)**

**Access:** Admin | **Purpose:** Search and filter user accounts.

**Status:** Implemented in the backend.

Query parameters:

| Query | Description |
| :---- | :---- |
| role | Filter by role (participant, judge, admin, university) |
| status | Filter by status (active, suspended) |
| search | Name or email search |
| page / limit | Pagination controls |

**GET http://localhost:3000/api/v1/admin/users/{userId} (Implemented)**

**Access:** Admin | **Purpose:** Return an admin view of a single user.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| userId | User identifier (24-char hex ObjectId) |



**PATCH /admin/users/{userId}/suspend (Implemented)**

**Access:** Admin | **Purpose:** Disable a user account.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| userId | User identifier (24-char hex ObjectId) |

**PATCH http://localhost:3000/api/v1/admin/users/{userId}/restore** 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| userId  | user identifier |

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| reason  | human-readable admin reason |

**PATCH /admin/users/{userId}/restore (Implemented)**

**Access:** Admin | **Purpose:** Restore a suspended user.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| userId | User identifier (24-char hex ObjectId) |



**POST /admin/users/{userId}/reset-password (Implemented)**

**Access:** Admin | **Purpose:** Help a user regain access.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| userId | User identifier (24-char hex ObjectId) |

Request body fields:

| Field | Meaning |
| :---- | :---- |
| password | New temporary password (min 6 chars, 1 uppercase, 1 special) |

**GET http://localhost:3000/api/v1/admin/settings (Implemented)**

**Access:** Admin | **Purpose:** Read current platform settings.

**Status:** Implemented in the backend.

**PATCH http://localhost:3000/api/v1/admin/settings/payment (Implemented)**

**Access:** Admin | **Purpose:** Update payment gateway configuration.

**Status:** Implemented in the backend.

Request body: Flexible object with payment configuration (min 1 field required). Accepts any valid payment gateway configuration fields.

**PATCH http://localhost:3000/api/v1/admin/settings/email-templates/{templateKey} (Not Implemented)** 

 Request body fields: 

| Field  | Meaning |
| :---- | :---- |
| gateway  | razorpay or stripe |
| keyId  | Razorpay key id |
| keySecret  | Razorpay key secret |
| secretKey  | Stripe secret key |
| webhookSecret  | Stripe webhook secret |

 Accepted input options: 

 Razorpay shape: { gateway: "razorpay", keyId, keySecret } 

 Stripe shape: { gateway: "stripe", secretKey, webhookSecret } 

**PATCH /admin/settings/email-templates/{templateKey}** 

**Access:** Admin | **Purpose:** Update email template content.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| templateKey  | verify-email, team-invite, registration-success,  result-published, or certificate-ready |

 Request body fields:

| Field  | Meaning |
| :---- | :---- |
| subject  | template subject line |
| html  | template body |

  38 

**14\. Analytics and reports** 

Analytics endpoints serve dashboard charts and aggregated metrics. Report endpoints export  operational files such as participant lists, revenue summaries, and university performance reports. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| GET | http://localhost:3000/api/v1/admin/analytics/dashboard | Admin | High-level metrics (dashboard) (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/hackathons/stats | Admin | Hackathon statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/users/stats | Admin | User statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/registrations/stats | Admin | Registration statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/submissions/stats | Admin | Submission statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/results/stats | Admin | Results statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/payments/stats | Admin | Revenue/payment statistics (Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/overview | Admin | High-level metrics (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/registrations | Admin | Registrations chart data (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/revenue | Admin | Revenue chart data (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/participation-trends | Admin | Solo vs team trends (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/universities | Admin | Top universities (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/judges | Admin | Judge activity (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/analytics/certificates | Admin | Certificate metrics (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports | Admin | List all reports (Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports/{reportId} | Admin | Get report details (Implemented) |
| POST | http://localhost:3000/api/v1/admin/reports | Admin | Create a report (Implemented) |
| PATCH | http://localhost:3000/api/v1/admin/reports/{reportId} | Admin | Update a report (Implemented) |
| POST | http://localhost:3000/api/v1/admin/reports/{reportId}/run | Admin | Run a report (Implemented) |
| DELETE | http://localhost:3000/api/v1/admin/reports/{reportId} | Admin | Delete a report (Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports/participants | Admin | Participant report export (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports/winners | Admin | Winners report export (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports/revenue | Admin | Revenue report export (Not Implemented) |
| GET | http://localhost:3000/api/v1/admin/reports/universities | Admin | University report export (Not Implemented) |

**GET http://localhost:3000/api/v1/admin/analytics/dashboard (Implemented)**

**Access:** Admin | **Purpose:** Return top-level dashboard metrics.

**Status:** Implemented in the backend.

Query parameters:

| Query | Description |
| :---- | :---- |
| from / to | Optional date range |

**GET http://localhost:3000/api/v1/admin/analytics/hackathons/stats (Implemented)**

**Access:** Admin | **Purpose:** Return hackathon statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/users/stats (Implemented)**

**Access:** Admin | **Purpose:** Return user statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/registrations/stats (Implemented)**

**Access:** Admin | **Purpose:** Return registration statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/submissions/stats (Implemented)**

**Access:** Admin | **Purpose:** Return submission statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/results/stats (Implemented)**

**Access:** Admin | **Purpose:** Return results statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/payments/stats (Implemented)**

**Access:** Admin | **Purpose:** Return payment statistics.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/analytics/overview (Not Implemented)** 

**Access:** Admin | **Purpose:** Return top-level dashboard metrics.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| from / to  | optional date range |

**GET http://localhost:3000/api/v1/admin/analytics/registrations (Not Implemented)** 

**Access:** Admin | **Purpose:** Return time-series registration data.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters:

| Query  | Description |
| :---- | :---- |
| groupBy  | daily, weekly, or monthly |
| hackathonId  | optional event filter |

  39   
**GET http://localhost:3000/api/v1/admin/analytics/revenue (Not Implemented)** 

**Access:** Admin | **Purpose:** Return revenue chart data.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| groupBy  | daily, weekly, or monthly |
| hackathonId  | optional event filter |
| currency  | optional currency code |

**GET http://localhost:3000/api/v1/admin/analytics/participation-trends (Not Implemented)** 

**Access:** Admin | **Purpose:** Compare solo and team registrations over time or by event.

**Status:** This endpoint is not yet implemented in the backend.  Query parameters: 

| Query  | Description |
| :---- | :---- |
| mode  | solo, team, or all |

**GET http://localhost:3000/api/v1/admin/analytics/universities (Not Implemented)** 

**Access:** Admin | **Purpose:** Show top universities by participants or winners.

**Status:** This endpoint is not yet implemented in the backend.  Query parameters: 

| Query  | Description |
| :---- | :---- |
| sortBy  | participants or winners |
| limit  | maximum results |

**GET http://localhost:3000/api/v1/admin/analytics/judges (Not Implemented)** 

**Access:** Admin | **Purpose:** Show average judging time, pending reviews, and score distribution.

**Status:** This endpoint is not yet implemented in the backend. 

**GET http://localhost:3000/api/v1/admin/analytics/certificates (Not Implemented)** 

**Access:** Admin | **Purpose:** Show certificate generation and download metrics.

**Status:** This endpoint is not yet implemented in the backend.

**GET http://localhost:3000/api/v1/admin/reports (Implemented)**

**Access:** Admin | **Purpose:** List all reports with filters.

**Status:** Implemented in the backend.

**GET http://localhost:3000/api/v1/admin/reports/{reportId} (Implemented)**

**Access:** Admin | **Purpose:** Get detailed report information.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| reportId | Report identifier (24-char hex ObjectId) |

**POST http://localhost:3000/api/v1/admin/reports (Implemented)**

**Access:** Admin | **Purpose:** Create a new report.

**Status:** Implemented in the backend.

Request body fields:

| Field | Meaning | Required |
| :---- | :---- | :---- |
| name | Report name (min 3, max 200 chars) | Yes |
| type | "summary", "activity", "financial", or "participant" | Yes |
| description | Report description (max 1000 chars) | No |
| schedule | Object with cron and timezone | No |
| filters | Custom filter object | No |

**PATCH http://localhost:3000/api/v1/admin/reports/{reportId} (Implemented)**

**Access:** Admin | **Purpose:** Update an existing report.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| reportId | Report identifier (24-char hex ObjectId) |

Request body fields:

| Field | Meaning |
| :---- | :---- |
| name | Report name (min 3, max 200 chars) |
| description | Report description (max 1000 chars) |
| status | "draft", "scheduled", "active", or "archived" |
| schedule | Object with cron and timezone |
| filters | Custom filter object |

**POST http://localhost:3000/api/v1/admin/reports/{reportId}/run (Implemented)**

**Access:** Admin | **Purpose:** Execute a report.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| reportId | Report identifier (24-char hex ObjectId) |

**DELETE http://localhost:3000/api/v1/admin/reports/{reportId} (Implemented)**

**Access:** Admin | **Purpose:** Delete a report.

**Status:** Implemented in the backend.

Path parameters:

| Parameter | Description |
| :---- | :---- |
| reportId | Report identifier (24-char hex ObjectId) |

  40   
**GET /admin/reports/participants** 

**Access:** Admin | **Purpose:** Export participant report. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| hackathonId  | event filter |
| format  | csv or pdf |

**GET /admin/reports/winners** 

**Access:** Admin | **Purpose:** Export winners report. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| hackathonId  | event filter |
| format  | csv or pdf |

**GET /admin/reports/revenue** 

**Access:** Admin | **Purpose:** Export revenue report. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| hackathonId  | event filter |
| format  | csv or pdf |

**GET /admin/reports/universities** 

**Access:** Admin | **Purpose:** Export university performance report. 

 Query parameters:

| Query  | Description |
| :---- | :---- |
| format  | csv or pdf |
| from / to  | optional date range |

  41   
**15\. Notifications and real-time events** 

Notification endpoints support in-app reading state, while Socket.IO or another real-time layer should  broadcast high-value events such as invitations, payment updates, and result publication. 

| Method  | Path  | Access  | Purpose |
| :---- | :---- | :---- | :---- |
| GET | http://localhost:3000/api/v1/notifications | Authenticated | List notifications (**Not Implemented**) |
| PATCH | http://localhost:3000/api/v1/notifications/{notificationId}/read | Authenticated | Mark one notification as read (**Not Implemented**) |
| PATCH | http://localhost:3000/api/v1/notifications/read-all | Authenticated | Mark all notifications as read (**Not Implemented**) |

**GET http://localhost:3000/api/v1/notifications (Not Implemented)** 

**Access:** Authenticated | **Purpose:** List in-app notifications.

**Status:** This endpoint is not yet implemented in the backend. 

 Query parameters: 

| Query  | Description |
| :---- | :---- |
| isRead  | true or false |
| page / limit  | pagination controls |

**PATCH http://localhost:3000/api/v1/notifications/{notificationId}/read (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Mark one notification as read.

**Status:** This endpoint is not yet implemented in the backend. 

 Path parameters: 

| Parameter  | Description |
| :---- | :---- |
| notificationId  | notification identifier |

**PATCH http://localhost:3000/api/v1/notifications/read-all (Not Implemented)** 

**Access:** Authenticated | **Purpose:** Mark all notifications as read.

**Status:** This endpoint is not yet implemented in the backend. 

**16\. Recommended Socket events**

| Direction  | Event  | When to emit |
| :---- | :---- | :---- |
| Server \-\> client  | team.invited  | A user is invited into a team |
| Server \-\> client  | team.inviteAccepted  | A pending invite is accepted |
| Server \-\> client  | registration.confirmed  | Registration succeeds, often  after payment confirmation |
| Server \-\> client  | payment.updated  | Payment status changes |
| Server \-\> client  | submission.received  | A new submission version is  saved |

  42 

| Direction  | Event  | When to emit |
| :---- | :---- | :---- |
| Server \-\> client  | results.published  | Results become visible to   participants |
| Server \-\> client  | leaderboard.updated  | Live leaderboard data changes |
| Server \-\> client  | notification.created  | A new in-app notification is  created |
| Client \-\> server  | notification.read  | Client marks one notification as read |
| Client \-\> server  | join.user.room  | Client subscribes to a user specific room |

**17\. Final build checklist** 

 Confirm every endpoint has backend-side validation and role plus ownership checks.  Confirm registration and payment workflows cannot be completed by client-side status alone.  Confirm submission deadlines, team-size limits, and uniqueness rules are enforced in services, not  just the UI. 

 Confirm score overrides and payment refunds create audit records. 

 Confirm certificate verification uses random non-sequential codes and a public-safe response shape.  Confirm all export endpoints either stream files safely or enqueue background jobs for large datasets.

src/

├── app.js

├── server.js

│

├── config/

│   ├── env.js

│   ├── db.js

│   ├── cors.js

│   ├── helmet.js

│   ├── rateLimit.js

│   ├── logger.js

│   ├── socket.js

│   ├── cloudinary.js

│   ├── razorpay.js

│   ├── mail.js

│   └── queue.js

│

├── routes/

│   ├── index.js

│   └── health.routes.js

│

├── modules/

│   ├── auth/

│   │   ├── auth.routes.js

│   │   ├── auth.controller.js

│   │   ├── auth.service.js

│   │   ├── auth.repository.js

│   │   ├── auth.validation.js

│   │   ├── auth.middleware.js

│   │   ├── auth.tokens.js

│   │   ├── auth.session.service.js

│   │   └── auth.constants.js

│   │

│   ├── users/

│   │   ├── user.routes.js

│   │   ├── user.controller.js

│   │   ├── user.service.js

│   │   ├── user.repository.js

│   │   ├── user.model.js

│   │   ├── user.validation.js

│   │   ├── user.mapper.js

│   │   └── user.constants.js

│   │

│   ├── hackathons/

│   │   ├── hackathon.routes.js

│   │   ├── hackathon.controller.js

│   │   ├── hackathon.service.js

│   │   ├── hackathon.repository.js

│   │   ├── hackathon.model.js

│   │   ├── hackathon.validation.js

│   │   ├── hackathon.mapper.js

│   │   ├── hackathon.policy.js

│   │   └── hackathon.constants.js

│   │

│   ├── teams/

│   │   ├── team.routes.js

│   │   ├── team.controller.js

│   │   ├── team.service.js

│   │   ├── team.repository.js

│   │   ├── team.model.js

│   │   ├── invitation.model.js

│   │   ├── invitation.service.js

│   │   ├── invitation.token.js

│   │   ├── team.validation.js

│   │   ├── team.policy.js

│   │   └── team.constants.js

│   │

│   ├── registrations/

│   │   ├── registration.routes.js

│   │   ├── registration.controller.js

│   │   ├── registration.service.js

│   │   ├── registration.repository.js

│   │   ├── registration.model.js

│   │   ├── registration.validation.js

│   │   ├── registration.policy.js

│   │   └── registration.constants.js

│   │

│   ├── payments/

│   │   ├── payment.routes.js

│   │   ├── payment.controller.js

│   │   ├── payment.service.js

│   │   ├── payment.repository.js

│   │   ├── payment.model.js

│   │   ├── payment.validation.js

│   │   ├── payment.webhook.controller.js

│   │   ├── payment.webhook.service.js

│   │   ├── payment.reconciliation.service.js

│   │   ├── payment.constants.js

│   │   └── gateways/

│   │       ├── razorpay.gateway.js

│   │       ├── stripe.gateway.js

│   │       └── gateway.interface.js

│   │

│   ├── submissions/

│   │   ├── submission.routes.js

│   │   ├── submission.controller.js

│   │   ├── submission.service.js

│   │   ├── submission.repository.js

│   │   ├── submission.model.js

│   │   ├── submissionVersion.model.js

│   │   ├── submission.validation.js

│   │   ├── submission.policy.js

│   │   ├── upload.service.js

│   │   ├── asset.service.js

│   │   └── submission.constants.js

│   │

│   ├── judging/

│   │   ├── judging.routes.js

│   │   ├── judging.controller.js

│   │   ├── judging.service.js

│   │   ├── judging.repository.js

│   │   ├── score.model.js

│   │   ├── rubric.service.js

│   │   ├── aggregation.service.js

│   │   ├── judging.validation.js

│   │   ├── judging.policy.js

│   │   └── judging.constants.js

│   │

│   ├── results/

│   │   ├── result.routes.js

│   │   ├── result.controller.js

│   │   ├── result.service.js

│   │   ├── result.repository.js

│   │   ├── ranking.service.js

│   │   ├── tieBreaker.service.js

│   │   ├── publish.service.js

│   │   ├── result.validation.js

│   │   └── result.constants.js

│   │

│   ├── certificates/

│   │   ├── certificate.routes.js

│   │   ├── certificate.controller.js

│   │   ├── certificate.service.js

│   │   ├── certificate.repository.js

│   │   ├── certificate.model.js

│   │   ├── certificate.template.service.js

│   │   ├── certificate.pdf.service.js

│   │   ├── certificate.verify.service.js

│   │   ├── qr.service.js

│   │   ├── certificate.validation.js

│   │   └── certificate.constants.js

│   │

│   ├── universities/

│   │   ├── university.routes.js

│   │   ├── university.controller.js

│   │   ├── university.service.js

│   │   ├── university.repository.js

│   │   ├── university.model.js

│   │   ├── university.validation.js

│   │   ├── university.policy.js

│   │   ├── student-mapping.service.js

│   │   ├── university-report.service.js

│   │   └── university.constants.js

│   │

│   ├── analytics/

│   │   ├── analytics.routes.js

│   │   ├── analytics.controller.js

│   │   ├── analytics.service.js

│   │   ├── analytics.repository.js

│   │   ├── analytics.pipeline.js

│   │   ├── analytics.cache.js

│   │   ├── analytics.validation.js

│   │   └── analytics.constants.js

│   │

│   └── notifications/

│       ├── notification.routes.js

│       ├── notification.controller.js

│       ├── notification.service.js

│       ├── notification.repository.js

│       ├── notification.model.js

│       ├── notification.socket.js

│       ├── notification.mailer.js

│       ├── notification.validation.js

│       └── notification.constants.js

│

├── middleware/

│   ├── auth.middleware.js

│   ├── role.middleware.js

│   ├── ownership.middleware.js

│   ├── rateLimit.middleware.js

│   ├── validate.middleware.js

│   ├── error.middleware.js

│   ├── notFound.middleware.js

│   ├── multer.middleware.js

│   ├── csrf.middleware.js

│   └── requestId.middleware.js

│

├── libs/

│   ├── jwt.js

│   ├── bcrypt.js

│   ├── cloudinary.js

│   ├── mailer.js

│   ├── razorpay.js

│   ├── queue.js

│   ├── audit.js

│   ├── apiError.js

│   ├── apiResponse.js

│   ├── asyncHandler.js

│   ├── pagination.js

│   ├── generateSlug.js

│   ├── generateCode.js

│   ├── date.js

│   └── crypto.js

│

├── utils/

│   ├── validators/

│   │   ├── auth.validator.js

│   │   ├── objectId.validator.js

│   │   ├── url.validator.js

│   │   ├── payment.validator.js

│   │   └── file.validator.js

│   │

│   ├── formatters/

│   │   ├── user.formatter.js

│   │   ├── hackathon.formatter.js

│   │   ├── certificate.formatter.js

│   │   └── analytics.formatter.js

│   │

│   ├── helpers/

│   │   ├── pick.js

│   │   ├── omit.js

│   │   ├── deepClone.js

│   │   ├── safeJsonParse.js

│   │   └── buildQuery.js

│   │

│   └── constants/

│       ├── roles.js

│       ├── hackathonStatus.js

│       ├── registrationStatus.js

│       ├── paymentStatus.js

│       ├── submissionStatus.js

│       ├── certificateTypes.js

│       └── notificationTypes.js

│

├── database/

│   ├── indexes.js

│   ├── seeders/

│   │   ├── admin.seeder.js

│   │   ├── university.seeder.js

│   │   └── hackathon.seeder.js

│   └── migrations/

│

├── jobs/

│   ├── sendVerificationEmail.job.js

│   ├── sendInvitationEmail.job.js

│   ├── registrationConfirmation.job.js

│   ├── generateCertificate.job.js

│   ├── publishResults.job.js

│   ├── sendResultNotification.job.js

│   ├── cleanExpiredTokens.job.js

│   └── reconcilePayments.job.js

│

├── templates/

│   ├── emails/

│   │   ├── verify-email.hbs

│   │   ├── forgot-password.hbs

│   │   ├── team-invite.hbs

│   │   ├── registration-success.hbs

│   │   ├── payment-failed.hbs

│   │   ├── result-published.hbs

│   │   └── certificate-ready.hbs

│   │

│   └── certificates/

│       ├── participation.template.html

│       ├── rank.template.html

│       ├── certificate.styles.css

│       └── assets/

│           ├── logo.png

│           └── signature.png

│

├── sockets/

│   ├── index.js

│   ├── events.js

│   ├── handlers/

│   │   ├── team.handler.js

│   │   ├── notification.handler.js

│   │   ├── results.handler.js

│   │   └── leaderboard.handler.js

│   └── rooms/

│       ├── user.room.js

│       ├── hackathon.room.js

│       └── judge.room.js

│

├── docs/

│   ├── swagger.js

│   └── openapi.json

│

├── tests/

│   ├── setup.js

│   ├── unit/

│   ├── integration/

│   └── e2e/

│

└── public/

    └── uploads/

**Hackathon Backend Architecture and File Reference Guide** 

Developer-friendly reference for the proposed JavaScript backend structure. Left side shows the file path; right side explains exactly what the file is supposed to own. 

**How to use this guide** 

• Start with the section for the folder you are working in. Each table row explains the responsibility of a specific file so you know where new code should go. • Use the convention notes to keep the codebase clean: controllers stay thin, services hold business logic, repositories handle queries, and policies enforce object-level access. • When several files look similar, the description column tells you the difference. That is the main goal of this revision: remove ambiguity for developers joining the project. 

**Recommended request flow** 

routes \-\> validate.middleware \-\> controller \-\> service \-\> repository \-\> model \-\> apiResponse 

Cross-cutting security checks such as auth, role, ownership, rate limiting, upload safety, and audit logging should be layered around this flow rather than mixed directly into controllers. 

**High-level structure snapshot** 

src/   
 app.js, server.js   
 config/ infrastructure and provider setup   
 routes/ top-level router mounting   
 modules/ feature modules (auth, hackathons, teams, judging, etc.)   
 middleware/ shared request pipeline guards   
 libs/ low-level shared helpers   
 utils/ validators, formatters, constants, object helpers   
 database/ indexes, seeders, migrations   
 jobs/ background tasks   
 templates/ email and certificate views   
 sockets/ realtime events and room logic   
 docs/ Swagger/OpenAPI artifacts   
 tests/ automated test suites   
 public/ local static upload area

 1 

**Root files** 

These files start the application and define the overall boot sequence. 

• Keep app creation separate from process startup so tests can import the Express app without opening a real port. 

• A clean split between app.js and server.js makes deployment, testing, and Socket.IO setup easier to reason about. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/app.js  | Creates the Express application, loads global middleware, mounts route groups, and wires central error handling without starting the server itself. |
| src/server.js  | Bootstraps the runtime: loads environment config, connects MongoDB, creates the HTTP server, attaches Socket.IO, and starts listening on the configured port. |

**config/** 

Cross-cutting infrastructure configuration. Put all environment-dependent boot logic here so features can depend on stable wrappers instead of raw SDK setup. • Whenever a third-party SDK appears in business code, first check whether it should be accessed through config/ or libs/ instead. 

• This folder is the right place for feature flags, environment validation, and provider-specific initialization.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/config/env.js  | Reads and validates environment variables, normalizes defaults, and exposes a typed-ish config object for the rest of the app. |
| src/config/db.js  | Initializes the MongoDB connection and centralizes database connection options, retries, and startup logging. |
| src/config/cors.js  | Defines allowed origins, headers, methods, and credentials policy for browser requests. |
| src/config/helmet.js  | Applies secure HTTP headers such as CSP, frameguard, and content-type protections. |
| src/config/rateLimit.js  | Defines reusable rate-limit presets for login, password reset, public verification, and other abuse-sensitive routes. |
| src/config/logger.js  | Builds the application logger and shared logging format for console, file, or external transports. |
|  src/config/socket.js  |  Configures the Socket.IO server, auth handshake rules, shared events, and room bootstrap behavior. |
| src/config/cloudinary.js  | Central Cloudinary SDK setup for uploads, delivery URLs, and resource deletion. |
| src/config/razorpay.js  | Loads Razorpay credentials and returns an initialized gateway client used by the payments module. |
| src/config/mail.js  | Creates the mail transport and default sending options for transactional emails. |
| src/config/queue.js  | Configures BullMQ or the queue backend connection so background jobs can enqueue and process work reliably. |

 2   
**routes/** 

Top-level routing glue. These files expose global routes that are not tied to a single feature module or combine module routers under the API prefix. • Keep these files thin. Business logic should stay inside modules, not in the global router. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/routes/index.js  | Combines all module route files into the main router and mounts them under the correct base paths such as /auth, /hackathons, and /admin. |
| src/routes/health.routes.js  | Exposes health/readiness endpoints used by developers, deployment platforms, uptime checks, and container orchestration. |

**modules/auth/** 

Owns login, registration, refresh tokens, password resets, email verification, and session lifecycle. 

• This module is security-critical. Changes here affect nearly every protected endpoint. 

• Keep token creation rules and refresh token rotation centralized to avoid inconsistent auth behavior. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/auth/auth.routes.js  | Defines Express routes for the authentication domain and maps each endpoint to a controller. |
|  src/modules/auth/auth.controller.js  |  Handles HTTP request/response flow for authentication, including parsing inputs and returning standardized API responses. |
| src/modules/auth/auth.service.js  | Contains the core business rules for authentication; this is where workflow decisions and validations that depend on data live. |
| src/modules/auth/auth.repository.js  | Encapsulates database reads/writes for authentication so query logic stays out of controllers and services. |
| src/modules/auth/auth.validation.js  | Declares request validation rules for authentication payloads, query strings, and route params. |
| src/modules/auth/auth.middleware.js  | Adds auth-specific checks that are only needed inside the auth module, such as refresh-token guards or email-verification gating. |
| src/modules/auth/auth.tokens.js  | Creates, verifies, rotates, and decodes access tokens, refresh tokens, password-reset tokens, and email-verification tokens. |
| src/modules/auth/auth.session.service.js  | Manages session lifecycle rules such as refresh token rotation, revocation, replay detection, and logout cleanup. |
| src/modules/auth/auth.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the authentication module. |

**modules/users/** 

Manages participant/admin/judge/university user profiles, profile editing, and user-facing read models.

 3   
• This module should never expose sensitive fields like password hashes or hidden admin flags directly. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/users/user.routes.js  | Defines Express routes for the user domain and maps each endpoint to a controller. |
| src/modules/users/user.controller.js  | Handles HTTP request/response flow for user, including parsing inputs and returning standardized API responses. |
| src/modules/users/user.service.js  | Contains the core business rules for user; this is where workflow decisions and validations that depend on data live. |
| src/modules/users/user.repository.js  | Encapsulates database reads/writes for user so query logic stays out of controllers and services. |
| src/modules/users/user.model.js  | Defines the Mongoose schema and model for user records stored in MongoDB. |
| src/modules/users/user.validation.js  | Declares request validation rules for user payloads, query strings, and route params. |
| src/modules/users/user.mapper.js  | Transforms user documents into consistent API response shapes so the frontend does not depend on raw database structure. |
| src/modules/users/user.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the user module. |

**modules/hackathons/** 

Defines event creation, browsing, filters, timelines, sponsor data, rules, and judging configuration. 

• Treat deadlines and mode rules as authoritative here so other modules can query them instead of re-implementing them.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/hackathons/hackathon.routes.js  | Defines Express routes for the hackathon domain and maps each endpoint to a controller. |
| src/modules/hackathons/hackathon.controller.js  | Handles HTTP request/response flow for hackathon, including parsing inputs and returning standardized API responses. |
| src/modules/hackathons/hackathon.service.js  | Contains the core business rules for hackathon; this is where workflow decisions and validations that depend on data live. |
| src/modules/hackathons/hackathon.repository.js  | Encapsulates database reads/writes for hackathon so query logic stays out of controllers and services. |
| src/modules/hackathons/hackathon.model.js  | Defines the Mongoose schema and model for hackathon records stored in MongoDB. |
| src/modules/hackathons/hackathon.validation.js  | Declares request validation rules for hackathon payloads, query strings, and route params. |
| src/modules/hackathons/hackathon.mapper.js  | Transforms hackathon documents into consistent API response shapes so the frontend does not depend on raw database structure. |
| src/modules/hackathons/hackathon.policy.js  | Checks authorization and object-level access rules for hackathon, such as ownership, role, and state checks. |
| src/modules/hackathons/hackathon.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the hackathon module. |

 4   
**modules/teams/** 

Handles team creation, membership, invitation links, invite acceptance, and team-related permission checks. 

• Keep invitation state explicit; do not infer membership changes from email events alone. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/teams/team.routes.js  | Defines Express routes for the team domain and maps each endpoint to a controller. |
| src/modules/teams/team.controller.js  | Handles HTTP request/response flow for team, including parsing inputs and returning standardized API responses. |
| src/modules/teams/team.service.js  | Contains the core business rules for team; this is where workflow decisions and validations that depend on data live. |
| src/modules/teams/team.repository.js  | Encapsulates database reads/writes for team so query logic stays out of controllers and services. |
| src/modules/teams/team.model.js  | Defines the Mongoose schema and model for team records stored in MongoDB. |
| src/modules/teams/invitation.model.js  | Stores team invitation records, including invitee identity, token metadata, acceptance state, and expiry. |
| src/modules/teams/invitation.service.js  | Implements the invitation workflow: create invite, send invite, accept/decline invite, and synchronize team membership. |
| src/modules/teams/invitation.token.js  | Creates and validates signed invitation tokens embedded in team invite links. |
| src/modules/teams/team.validation.js  | Declares request validation rules for team payloads, query strings, and route params. |
| src/modules/teams/team.policy.js  | Checks authorization and object-level access rules for team, such as ownership, role, and state checks. |
| src/modules/teams/team.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the team module. |

**modules/registrations/** 

Owns the act of joining a hackathon, whether solo or team-based, plus registration status and fee linkage. 

• This module should be the single place that decides whether a user or team is actually registered.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/registrations/registration.routes.js  | Defines Express routes for the registration domain and maps each endpoint to a controller. |
| src/modules/registrations/registration.controller.js  | Handles HTTP request/response flow for registration, including parsing inputs and returning standardized API responses. |
| src/modules/registrations/registration.service.js  | Contains the core business rules for registration; this is where workflow decisions and validations that depend on data live. |
| src/modules/registrations/registration.repository.js  | Encapsulates database reads/writes for registration so query logic stays out of controllers and services. |

 5 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/registrations/registration.model.js  | Defines the Mongoose schema and model for registration records stored in MongoDB. |
| src/modules/registrations/registration.validation.js  | Declares request validation rules for registration payloads, query strings, and route params. |
| src/modules/registrations/registration.policy.js  | Checks authorization and object-level access rules for registration, such as ownership, role, and state checks. |
| src/modules/registrations/registration.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the registration module. |

**modules/payments/** 

Manages paid registrations, payment orders, gateway callbacks, refunds, and reconciliation. 

• Never trust the frontend alone for payment success. Final registration confirmation should be gateway-verified here. 

• Webhook handling must be idempotent to survive retries.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/payments/payment.routes.js  | Defines Express routes for the payment domain and maps each endpoint to a controller. |
| src/modules/payments/payment.controller.js  | Handles HTTP request/response flow for payment, including parsing inputs and returning standardized API responses. |
| src/modules/payments/payment.service.js  | Contains the core business rules for payment; this is where workflow decisions and validations that depend on data live. |
| src/modules/payments/payment.repository.js  | Encapsulates database reads/writes for payment so query logic stays out of controllers and services. |
| src/modules/payments/payment.model.js  | Defines the Mongoose schema and model for payment records stored in MongoDB. |
| src/modules/payments/payment.validation.js  | Declares request validation rules for payment payloads, query strings, and route params. |
| src/modules/payments/payment.webhook.controller.js  | Receives gateway webhooks, verifies request shape/signature at the HTTP boundary, and delegates processing safely. |
| src/modules/payments/payment.webhook.service.js  | Processes verified payment events, updates payment status, confirms registrations, and keeps webhook handling idempotent. |
| src/modules/payments/payment.reconciliation.service.js  | Handles payment consistency checks, duplicate event cleanup, delayed confirmations, and audit reconciliation jobs. |
| src/modules/payments/payment.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the payment module. |
| src/modules/payments/gateways/razorpay.gateway.js  | Gateway adapter for Razorpay order creation, signature verification, refunds, and status checks. |
| src/modules/payments/gateways/stripe.gateway.js  | Gateway adapter for Stripe payment intents, webhooks, refunds, and status lookups. |

 6 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/payments/gateways/gateway.interface.js  | Documents the common gateway contract so each payment provider implements the same methods and return shapes. |

**modules/submissions/** 

Handles project submissions, resubmissions, uploaded assets, and submission history after registration is complete. 

• If version history matters to judges, keep old submission versions immutable instead of overwriting them. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/submissions/submission.routes.js  | Defines Express routes for the submission domain and maps each endpoint to a controller. |
| src/modules/submissions/submission.controller.js  | Handles HTTP request/response flow for submission, including parsing inputs and returning standardized API responses. |
| src/modules/submissions/submission.service.js  | Contains the core business rules for submission; this is where workflow decisions and validations that depend on data live. |
| src/modules/submissions/submission.repository.js  | Encapsulates database reads/writes for submission so query logic stays out of controllers and services. |
| src/modules/submissions/submission.model.js  | Defines the Mongoose schema and model for submission records stored in MongoDB. |
| src/modules/submissions/submissionVersion.model.js  | Stores immutable snapshots of older submission versions so participants can resubmit without losing history. |
| src/modules/submissions/submission.validation.js  | Declares request validation rules for submission payloads, query strings, and route params. |
| src/modules/submissions/submission.policy.js  | Checks authorization and object-level access rules for submission, such as ownership, role, and state checks. |
| src/modules/submissions/upload.service.js  | Handles file upload orchestration, storage provider calls, upload validation, and safe metadata extraction. |
| src/modules/submissions/asset.service.js  | Manages submission assets after upload, including attach/detach logic, image URL normalization, and cleanup of unused files. |
| src/modules/submissions/submission.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the submission module. |

**modules/judging/** 

Covers judge assignment views, rubric-based scoring, score persistence, and score aggregation inputs. 

• This module should ensure judges only see or score submissions assigned to them.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/judging/judging.routes.js  | Defines Express routes for the judging domain and maps each endpoint to a controller. |

 7 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/judging/judging.controller.js  | Handles HTTP request/response flow for judging, including parsing inputs and returning standardized API responses. |
| src/modules/judging/judging.service.js  | Contains the core business rules for judging; this is where workflow decisions and validations that depend on data live. |
| src/modules/judging/judging.repository.js  | Encapsulates database reads/writes for judging so query logic stays out of controllers and services. |
| src/modules/judging/score.model.js  | Defines the stored judging score record, including judge reference, criterion-level scores, totals, and comments. |
| src/modules/judging/rubric.service.js  | Reads and validates the judging rubric for a hackathon so judges score against the correct weighted criteria. |
| src/modules/judging/aggregation.service.js  | Aggregates multiple judge scores into weighted totals and prepares data used later by ranking and result publication. |
| src/modules/judging/judging.validation.js  | Declares request validation rules for judging payloads, query strings, and route params. |
| src/modules/judging/judging.policy.js  | Checks authorization and object-level access rules for judging, such as ownership, role, and state checks. |
| src/modules/judging/judging.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the judging module. |

**modules/results/** 

Turns judged submissions into ranks, winners, runner-ups, special awards, and published result states. 

• Keep override history auditable so manual score or rank changes are traceable.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/results/result.routes.js  | Defines Express routes for the result domain and maps each endpoint to a controller. |
| src/modules/results/result.controller.js  | Handles HTTP request/response flow for result, including parsing inputs and returning standardized API responses. |
| src/modules/results/result.service.js  | Contains the core business rules for result; this is where workflow decisions and validations that depend on data live. |
| src/modules/results/result.repository.js  | Encapsulates database reads/writes for result so query logic stays out of controllers and services. |
| src/modules/results/ranking.service.js  | Converts aggregated judging output into ordered rankings, top-N winners, runner-ups, and award lists. |
| src/modules/results/tieBreaker.service.js  | Applies configured tie-breaking rules such as earlier submission, judge preference, or manual override. |
| src/modules/results/publish.service.js  | Publishes finalized results, updates participant-visible state, and triggers downstream notifications and certificate jobs. |
| src/modules/results/result.validation.js  | Declares request validation rules for result payloads, query strings, and route params. |

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/results/result.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the result module. |

**odules/certificates/** 

Generates, stores, verifies, and serves certificates for participation and winning ranks. 

• Use signed, short-lived download links when certificates live in cloud storage. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/certificates/certificate.routes.js  | Defines Express routes for the certificate domain and maps each endpoint to a controller. |
| src/modules/certificates/certificate.controller.js  | Handles HTTP request/response flow for certificate, including parsing inputs and returning standardized API responses. |
| src/modules/certificates/certificate.service.js  | Contains the core business rules for certificate; this is where workflow decisions and validations that depend on data live. |
| src/modules/certificates/certificate.repository.js  | Encapsulates database reads/writes for certificate so query logic stays out of controllers and services. |
| src/modules/certificates/certificate.model.js  | Defines the Mongoose schema and model for certificate records stored in MongoDB. |
| src/modules/certificates/certificate.template.service.js  | Builds certificate HTML/CSS data models and merges participant/rank data into the correct certificate template. |
| src/modules/certificates/certificate.pdf.service.js  | Generates certificate PDFs from templates and stores or uploads the final files. |
| src/modules/certificates/certificate.verify.service.js  | Implements public certificate verification by unique code and controls what information can be shown publicly. |
| src/modules/certificates/qr.service.js  | Generates QR codes that point to certificate verification pages or signed certificate routes. |
| src/modules/certificates/certificate.validation.js  | Declares request validation rules for certificate payloads, query strings, and route params. |
| src/modules/certificates/certificate.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the certificate module. |

**modules/universities/** 

Implements institution-level dashboards, student mapping by domain, and university-specific reporting. 

• Keep domain-based mapping conservative and auditable to prevent accidental cross-university access.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/universities/university.routes.js  | Defines Express routes for the university domain and maps each endpoint to a controller. |
| src/modules/universities/university.controller.js  | Handles HTTP request/response flow for university, including parsing inputs and returning standardized API responses. |

 9 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/universities/university.service.js  | Contains the core business rules for university; this is where workflow decisions and validations that depend on data live. |
| src/modules/universities/university.repository.js  | Encapsulates database reads/writes for university so query logic stays out of controllers and services. |
| src/modules/universities/university.model.js  | Defines the Mongoose schema and model for university records stored in MongoDB. |
| src/modules/universities/university.validation.js  | Declares request validation rules for university payloads, query strings, and route params. |
| src/modules/universities/university.policy.js  | Checks authorization and object-level access rules for university, such as ownership, role, and state checks. |
| src/modules/universities/student-mapping.service.js  | Maps participants to universities using verified email domains and maintains the institution-to-student relationship safely. |
| src/modules/universities/university-report.service.js  | Produces institution-specific CSV/PDF summaries covering participation, best ranks, and performance distribution. |
| src/modules/universities/university.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the university module. |

**modules/analytics/** 

Builds admin dashboards, trend charts, revenue summaries, and heavy aggregations used by reports. 

• This module should optimize read-heavy workloads and avoid duplicating aggregation logic across controllers. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/analytics/analytics.routes.js  | Defines Express routes for the analytics domain and maps each endpoint to a controller. |
| src/modules/analytics/analytics.controller.js  | Handles HTTP request/response flow for analytics, including parsing inputs and returning standardized API responses. |
|  src/modules/analytics/analytics.service.js  |  Contains the core business rules for analytics; this is where workflow decisions and validations that depend on data live. |
| src/modules/analytics/analytics.repository.js  | Encapsulates database reads/writes for analytics so query logic stays out of controllers and services. |
| src/modules/analytics/analytics.pipeline.js  | Holds Mongo aggregation pipelines and metric builders for dashboards, trend charts, and report datasets. |
| src/modules/analytics/analytics.cache.js  | Caches expensive analytics results so dashboards stay fast without re-running every aggregation on each request. |
| src/modules/analytics/analytics.validation.js  | Declares request validation rules for analytics payloads, query strings, and route params. |
| src/modules/analytics/analytics.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the analytics module. |

**modules/notifications/** 

Owns in-app notification records plus realtime and email fan-out for important system events.

 10   
• Treat notifications as delivery-capable records, not just transient socket messages. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/modules/notifications/notification.routes.js  | Defines Express routes for the notification domain and maps each endpoint to a controller. |
| src/modules/notifications/notification.controller.js  | Handles HTTP request/response flow for notification, including parsing inputs and returning standardized API responses. |
| src/modules/notifications/notification.service.js  | Contains the core business rules for notification; this is where workflow decisions and validations that depend on data live. |
| src/modules/notifications/notification.repository.js  | Encapsulates database reads/writes for notification so query logic stays out of controllers and services. |
| src/modules/notifications/notification.model.js  | Defines the Mongoose schema and model for notification records stored in MongoDB. |
| src/modules/notifications/notification.socket.js  | Pushes real-time notification events to the correct Socket.IO rooms when invites, results, or payment updates occur. |
| src/modules/notifications/notification.mailer.js  | Builds and sends email notifications tied to notification events, using templates and fallback content. |
| src/modules/notifications/notification.validation.js  | Declares request validation rules for notification payloads, query strings, and route params. |
| src/modules/notifications/notification.constants.js  | Keeps enums, status values, event names, and fixed configuration used only by the notification module. |

**middleware/** 

Shared Express middleware that applies across multiple modules and protects common request-processing stages. 

• Keep middleware generic and reusable; feature-specific rules belong in the module that owns the behavior. 

• Validation and authorization middleware should run before business logic to fail fast.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/middleware/auth.middleware.js  | Global authentication guard that extracts the bearer token, verifies it, and attaches the authenticated user context to the request. |
| src/middleware/role.middleware.js  | Restricts routes by role, such as admin-only, judge-only, or university-only access. |
| src/middleware/ownership.middleware.js  | Enforces object-level authorization so users can only access records they own or are assigned to. |
| src/middleware/rateLimit.middleware.js  | Shared wrapper for route-specific rate limiting; keeps abuse protection consistent across modules. |
| src/middleware/validate.middleware.js  | Runs request schema validation and returns clean validation errors before controller logic executes. |
| src/middleware/error.middleware.js  | Central error translator that turns thrown exceptions into safe, structured API responses. |
| src/middleware/notFound.middleware.js  | Returns a consistent 404 response for unknown routes. |
| src/middleware/multer.middleware.js  | Defines upload parsing rules, file size limits, and allowed MIME types for multipart endpoints. |

 11 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/middleware/csrf.middleware.js  | Protects cookie-based flows such as refresh/logout forms or admin actions from CSRF attacks when applicable. |
| src/middleware/requestId.middleware.js  | Assigns a trace/request ID so logs, jobs, and external calls can be correlated across the whole request lifecycle. |

**libs/** 

Shared low-level helpers and wrappers used by many parts of the codebase. This is the right place for technical utilities, not feature workflows. • A good test: if a file could be reused by multiple modules without knowing product context, libs/ is usually correct. 

• Avoid letting libs/ grow into a second business-logic layer.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/libs/jwt.js  | Low-level JWT helper functions shared across auth and middleware, kept separate from business-specific token policy. |
| src/libs/bcrypt.js  | Shared password hashing and comparison helpers so hashing policy stays consistent everywhere. |
| src/libs/cloudinary.js  | Thin storage wrapper used by multiple modules when they need upload/delete/signing operations. |
| src/libs/mailer.js  | Common mail-sending helper that hides transport details and standardizes mail options. |
| src/libs/razorpay.js  | Reusable low-level Razorpay helper for places that need direct access outside the payments module. |
| src/libs/queue.js  | Shared queue helper used to enqueue background work without every module knowing queue internals. |
| src/libs/audit.js  | Writes structured audit events for security-sensitive actions like score overrides, refunds, and admin account changes. |
| src/libs/apiError.js  | Custom error class used to throw consistent HTTP/application errors with status codes and machine-readable metadata. |
| src/libs/apiResponse.js  | Response formatter that keeps success responses consistent across controllers. |
| src/libs/asyncHandler.js  | Utility wrapper for async Express handlers so thrown promise errors reach the central error middleware cleanly. |
| src/libs/pagination.js  | Shared pagination helpers for parsing query params and building standard paginated API responses. |
| src/libs/generateSlug.js  | Creates URL-safe slugs for hackathons or other named resources. |
| src/libs/generateCode.js  | Generates unique short codes for certificates, invites, or public verification tokens. |
| src/libs/date.js  | Date/time utility helpers for deadlines, comparisons, and formatting. |
| src/libs/crypto.js  | App-level cryptographic helpers for secure random strings, hashing, token signatures, or encrypted payload support. |

 12   
**utils/** 

Small utilities, validators, formatters, and constants that help keep modules clean and consistent. 

• Use utils/ for narrowly scoped helpers. If logic becomes feature-specific, move it into the owning module.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/utils/validators/auth.validator.js  | Small reusable auth-related validation helpers, separate from request schemas, used across modules. |
| src/utils/validators/objectId.validator.js  | Checks Mongo ObjectId-like values early to prevent invalid IDs from reaching the database layer. |
| src/utils/validators/url.validator.js  | Validates external URLs such as GitHub repos, demo links, and certificate/public asset links. |
| src/utils/validators/payment.validator.js  | Shared payment field validation helpers for amount, currency, gateway identifiers, and signature input. |
| src/utils/validators/file.validator.js  | Reusable file validation rules for extension, MIME type, size, and upload safety checks. |
| src/utils/formatters/user.formatter.js  | Converts user data into frontend-friendly representations without leaking internal fields like hashed passwords or internal flags. |
| src/utils/formatters/hackathon.formatter.js  | Normalizes hackathon data for list/detail endpoints and dashboard cards. |
| src/utils/formatters/certificate.formatter.js  | Shapes certificate data for API responses, verification views, and download metadata. |
| src/utils/formatters/analytics.formatter.js  | Transforms raw analytics query output into chart-ready datasets and readable labels. |
| src/utils/helpers/pick.js  | Returns only allowed keys from an object, useful when building safe update payloads. |
| src/utils/helpers/omit.js  | Removes unwanted keys from an object before logging, storing, or returning data. |
| src/utils/helpers/deepClone.js  | Creates safe copies of nested objects so mutation in one part of the workflow does not affect another. |
| src/utils/helpers/safeJsonParse.js  | Parses JSON input defensively and returns controlled errors instead of crashing on malformed JSON. |
| src/utils/helpers/buildQuery.js  | Builds dynamic Mongo query objects from filters such as status, date ranges, search text, and role scope. |
| src/utils/constants/roles.js  | Canonical role names used throughout middleware, policies, analytics, and UI-facing responses. |
| src/utils/constants/hackathonStatus.js  | Hackathon lifecycle status constants such as draft, upcoming, ongoing, completed, or archived. |
| src/utils/constants/registrationStatus.js  | Registration state constants such as pending, confirmed, cancelled, or refunded. |
| src/utils/constants/paymentStatus.js  | Payment status constants such as pending, completed, failed, or refunded. |
| src/utils/constants/submissionStatus.js  | Submission state constants such as draft, submitted, late, locked, or reviewed. |
| src/utils/constants/certificateTypes.js  | Certificate type constants for participation, rank, special awards, or future certificate variants. |
| src/utils/constants/notificationTypes.js  | Notification event type constants used for in-app and email notification flows. |

 13   
**database/** 

Database lifecycle helpers, index registration, and seed data used for development or initial environment setup. 

• Keep seeders idempotent where possible so they can be re-run safely in development. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/database/indexes.js  | Registers important MongoDB indexes so unique constraints and query performance rules are easy to review in one place. |
| src/database/seeders/admin.seeder.js  | Creates an initial admin user for local setup or first deployment bootstrap. |
| src/database/seeders/university.seeder.js  | Seeds example universities or baseline institution records for development and testing. |
| src/database/seeders/hackathon.seeder.js  | Seeds sample hackathons so developers can test registrations, submissions, and judging flows quickly. |
| src/database/migrations/  | Reserved for one-time schema/data migration scripts when database changes cannot be handled purely through models. |

**jobs/** 

Background work units that should not block request-response cycles, especially email sending, certificate generation, and payment cleanup. • Anything slow, retryable, or external-service heavy usually belongs here rather than inside controllers. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/jobs/sendVerificationEmail.job.js  | Background worker that sends verification emails without blocking user registration requests. |
| src/jobs/sendInvitationEmail.job.js  | Background worker for team invitation emails triggered by the teams module. |
| src/jobs/registrationConfirmation.job.js  | Sends post-payment or free-registration confirmations after a registration is finalized. |
| src/jobs/generateCertificate.job.js  | Asynchronously generates participant and winner certificates after results are published. |
| src/jobs/publishResults.job.js  | Runs result publication steps that should happen asynchronously, including notification fan-out. |
| src/jobs/sendResultNotification.job.js  | Sends result announcements to participants, judges, or admins after publication. |
| src/jobs/cleanExpiredTokens.job.js  | Removes expired session, invite, or verification tokens so the database does not accumulate stale auth data. |
| src/jobs/reconcilePayments.job.js  | Periodically checks for payment/order mismatches and resolves or flags them for manual review. |

**templates/** 

Presentation-layer templates used by mail and certificate generation. They keep branded output separate from business logic. 

• Keeping templates out of services makes it easier for designers or frontend-minded developers to edit output safely.

 14 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/templates/emails/verify-email.hbs  | HTML email template sent when a new account must verify its email address. |
| src/templates/emails/forgot-password.hbs  | HTML email template used for password reset requests. |
| src/templates/emails/team-invite.hbs  | HTML email template for team invitation links and invite context. |
| src/templates/emails/registration-success.hbs  | HTML email template confirming a successful hackathon registration. |
| src/templates/emails/payment-failed.hbs  | HTML email template explaining a failed payment and next-step retry guidance. |
| src/templates/emails/result-published.hbs  | HTML email template announcing that results are now available. |
| src/templates/emails/certificate-ready.hbs  | HTML email template notifying participants that their certificate can be downloaded. |
| src/templates/certificates/participation.template.html  | Base HTML template used to render participation certificates before PDF generation. |
| src/templates/certificates/rank.template.html  | Base HTML template used to render winner/rank certificates before PDF generation. |
| src/templates/certificates/certificate.styles.css  | Shared certificate styling so both certificate templates keep a consistent brand and layout. |
| src/templates/certificates/assets/logo.png  | Brand asset inserted into certificate templates during rendering. |
| src/templates/certificates/assets/signature.png  | Signature or approval image placed on generated certificates. |

**sockets/** 

Real-time communication infrastructure for invitations, results, notifications, and optional live leaderboard updates. 

• Centralizing event names and room naming avoids subtle client/server drift.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/sockets/index.js  | Initializes socket namespaces, attaches handlers, and acts as the central entry point for real-time features. |
| src/sockets/events.js  | Defines shared socket event names so server and client stay aligned. |
| src/sockets/handlers/team.handler.js  | Contains real-time event handlers for team invites, acceptance, and related membership updates. |
| src/sockets/handlers/notification.handler.js  | Handles generic notification-related socket emission logic. |
| src/sockets/handlers/results.handler.js  | Pushes result publication and result-state updates to interested clients. |
| src/sockets/handlers/leaderboard.handler.js  | Handles real-time leaderboard updates during judging or live ranking views. |
| src/sockets/rooms/user.room.js  | Defines how individual user-specific rooms are named and joined. |
| src/sockets/rooms/hackathon.room.js  | Defines hackathon-scoped rooms for broadcasts tied to one event. |
| src/sockets/rooms/judge.room.js  | Defines judge-scoped rooms for assignment-specific real-time updates. |

 15   
**docs/** 

Developer-facing API documentation artifacts. These make the backend easier to explore, test, and hand off. 

• Treat the OpenAPI spec as a living contract that should stay close to the actual routes. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/docs/swagger.js  | Bootstraps Swagger/OpenAPI UI inside the app so developers can browse the API interactively. |
| src/docs/openapi.json  | Generated or maintained OpenAPI schema describing the backend routes, inputs, and outputs. |

**tests/** 

Automated tests covering isolated units, cross-module integration, and end-to-end workflows. 

• The most valuable e2e scenarios are the platform-critical flows that cross several modules. 

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/tests/setup.js  | Shared test bootstrap for environment setup, DB connections, test helpers, and common mocks. |
| src/tests/unit/  | Unit tests for pure logic such as utilities, services, policies, and validators. |
| src/tests/integration/  | Integration tests for routes \+ database \+ service interactions without full browser-level behavior. |
| src/tests/e2e/  | End-to-end tests for full workflows such as register \-\> pay \-\> submit \-\> judge \-\> publish results. |

**public/** 

Static or temporary publicly accessible assets for local development. 

• For production, prefer cloud storage and signed delivery URLs over serving sensitive files directly from the app host.

| File / Path  | Purpose / Responsibility |
| :---- | :---- |
| src/public/uploads/  | Temporary local upload area for development or fallback storage; production typically uses cloud storage instead. |

   
**Developer rules of thumb** 

• If a file talks HTTP, it belongs in a controller or route file. If it talks business rules, it belongs in a service. If it talks Mongo queries, it belongs in a repository. • Do not skip policy checks for convenience. Judge, university, and admin visibility rules are central to the platform. 

• Anything that sends email, generates PDFs, or waits on external gateways should usually move into jobs/ or queue-backed workers. • If logic becomes specific to one module, move it out of libs/ or utils/ and into the owning module so responsibility stays clear. • Prefer reusable constants for statuses and event names. Hard-coded strings spread bugs quickly in a multi-role system. • Make the OpenAPI docs and tests evolve with the routes; stale docs are almost as dangerous as no docs. 

**Suggested onboarding order for a new developer** 

• Read app.js, server.js, config/, routes/index.js. 

• Read auth/, users/, and middleware/ to understand request identity and permissions. 

• Read hackathons/, registrations/, teams/, and payments/ to understand the join flow. 

• Read submissions/, judging/, results/, and certificates/ to understand the event lifecycle after registration. 

• Read universities/, analytics/, notifications/, jobs/, and docs/ last; these become easier once the main workflow is clear.