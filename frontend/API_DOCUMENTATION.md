# LoanHub API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "borrower"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "borrower"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "borrower"
  }
}
```

---

## Loan Endpoints

### Get All Loans
```http
GET /loans
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "borrowerId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "lenderId": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "amount": 50000,
    "interestRate": 7.5,
    "tenure": 60,
    "status": "active",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "dueDate": "2029-01-15T00:00:00.000Z",
    "remainingAmount": 30000,
    "totalInterest": 18750
  }
]
```

### Get Borrower's Loans
```http
GET /loans/borrower/{borrowerId}
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "amount": 50000,
    "interestRate": 7.5,
    "tenure": 60,
    "status": "active",
    "remainingAmount": 30000
  }
]
```

### Create Loan
```http
POST /loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "borrowerId": "507f1f77bcf86cd799439012",
  "lenderId": "507f1f77bcf86cd799439013",
  "amount": 50000,
  "interestRate": 7.5,
  "tenure": 60
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "borrowerId": "507f1f77bcf86cd799439012",
  "lenderId": "507f1f77bcf86cd799439013",
  "amount": 50000,
  "interestRate": 7.5,
  "tenure": 60,
  "status": "active",
  "dueDate": "2029-01-15T00:00:00.000Z",
  "remainingAmount": 50000,
  "totalInterest": 18750
}
```

### Update Loan Status
```http
PUT /loans/{loanId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

---

## Application Endpoints

### Get All Applications
```http
GET /applications
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "borrowerId": "507f1f77bcf86cd799439012",
    "borrowerName": "Jane Smith",
    "loanAmount": 50000,
    "interestRate": 7.5,
    "tenure": 60,
    "purpose": "Business Expansion",
    "status": "pending",
    "appliedAt": "2024-01-10T00:00:00.000Z"
  }
]
```

### Create Application
```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "borrowerId": "507f1f77bcf86cd799439012",
  "loanAmount": 50000,
  "interestRate": 7.5,
  "tenure": 60,
  "purpose": "Business Expansion"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "borrowerId": "507f1f77bcf86cd799439012",
  "loanAmount": 50000,
  "status": "pending",
  "appliedAt": "2024-01-10T00:00:00.000Z"
}
```

### Approve Application
```http
PUT /applications/{applicationId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "reviewedBy": "507f1f77bcf86cd799439013"
}
```

### Reject Application
```http
PUT /applications/{applicationId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "rejected",
  "comments": "Insufficient credit history"
}
```

---

## Payment Endpoints

### Get All Payments
```http
GET /payments
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "loanId": "507f1f77bcf86cd799439011",
    "borrowerId": "507f1f77bcf86cd799439012",
    "amount": 1000,
    "date": "2024-02-15T00:00:00.000Z",
    "status": "completed",
    "method": "bank_transfer",
    "transactionId": "TXN123456"
  }
]
```

### Get Loan Payments
```http
GET /payments/{loanId}
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "amount": 1000,
    "date": "2024-02-15T00:00:00.000Z",
    "status": "completed"
  }
]
```

### Record Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "loanId": "507f1f77bcf86cd799439011",
  "borrowerId": "507f1f77bcf86cd799439012",
  "amount": 1000,
  "method": "bank_transfer"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "loanId": "507f1f77bcf86cd799439011",
  "amount": 1000,
  "date": "2024-02-15T00:00:00.000Z",
  "status": "completed",
  "method": "bank_transfer"
}
```

---

## Analytics Endpoints

### Dashboard Metrics
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalLoans": 150,
  "totalAmount": 7500000,
  "activeLoans": 120,
  "avgInterestRate": 7.2,
  "totalDisbursed": 7500000,
  "totalRecovered": 4500000,
  "defaultRate": 2.5
}
```

### Risk Assessment
```http
GET /analytics/risk
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "lowRisk": {
    "count": 80,
    "percentage": 66.7,
    "amount": 4000000
  },
  "mediumRisk": {
    "count": 30,
    "percentage": 25,
    "amount": 2500000
  },
  "highRisk": {
    "count": 10,
    "percentage": 8.3,
    "amount": 1000000
  }
}
```

### Financial Reports
```http
GET /analytics/reports?type=monthly&period=2024-01
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "period": "2024-01",
  "totalDisbursed": 500000,
  "totalCollected": 300000,
  "interestEarned": 45000,
  "defaultedLoans": 5,
  "newApplications": 20,
  "approvalRate": 75
}
```

---

## Admin Endpoints

### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "borrower",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create User
```http
POST /admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "lender"
}
```

### Update User Status
```http
PUT /admin/users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active"
}
```

### Delete User
```http
DELETE /admin/users/{userId}
Authorization: Bearer <token>
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 - Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 - Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 - Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Requests: 100 per minute per IP
- Burst: 10 requests per second

---

## Pagination

For list endpoints, use query parameters:
```
GET /loans?page=1&limit=10&sort=-createdAt
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

## Filtering & Sorting

### Filters
```
GET /loans?status=active&interestRate=7.5
```

### Sorting
```
GET /loans?sort=-amount
GET /loans?sort=amount
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Token Expiration

Tokens expire after the period specified in `.env` (default: 7 days).

Refresh tokens are returned in the login response.

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"pass123",
    "role":"borrower"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"pass123"
  }'

# Get Loans (with token)
curl -X GET http://localhost:5000/api/loans \
  -H "Authorization: Bearer <token>"
```

---

## Webhooks (Future)

Coming soon:
- Loan Created
- Payment Processed
- Application Approved
- Default Detected

---

For more information, see the main README.md and BACKEND_SETUP.md files.
