# API Documentation - Yiddish Jobs

Base URL: `http://localhost:3000/api` (development)

## 📌 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | Get all jobs with filters |
| GET | `/jobs/[id]` | Get single job by ID |
| GET | `/jobs/featured` | Get featured jobs |
| GET | `/categories` | Get all categories |
| POST | `/search` | Advanced job search |
| GET | `/stats` | Get site statistics |

---

## 1. Get All Jobs

**Endpoint:** `GET /api/jobs`

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Jobs per page (default: 10)
- `category` (string) - Filter by category
- `location` (string) - Filter by location
- `search` (string) - Search in title/description/company
- `genderCategory` (string) - Filter by gender category

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs?page=1&limit=20&category=Technology"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jobTitle": "Software Developer",
      "description": "Looking for an experienced developer...",
      "category": "Technology",
      "company": "Tech Corp",
      "emailInfo": "jobs@techcorp.com",
      "phoneNumber": "555-1234",
      "jobDate": "2025-10-15T00:00:00.000Z",
      "genderCategory": "Any",
      "companyVerified": true,
      "aiTitle": "Senior Software Developer",
      "aiDescription": "Seeking experienced software developer..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 473,
    "totalPages": 24
  }
}
```

---

## 2. Get Single Job

**Endpoint:** `GET /api/jobs/[id]`

**Path Parameters:**
- `id` (number) - Job ID

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs/123"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "jobTitle": "Accountant",
    "description": "Full job description...",
    "category": "Accounting & Finance",
    "company": "Financial Services Inc",
    "emailInfo": "careers@financial.com",
    "phoneNumber": "555-5678",
    "jobDate": "2025-10-10T00:00:00.000Z",
    "genderCategory": "Any",
    "companyVerified": true,
    "aiTitle": "Senior Accountant",
    "aiDescription": "Enhanced description...",
    "timeStamp": "2025-10-10 09:30:00",
    "publisher": 1,
    "titleYiddish": null,
    "descriptionYiddish": null
  }
}
```

---

## 3. Get Featured Jobs

**Endpoint:** `GET /api/jobs/featured`

**Query Parameters:**
- `limit` (number) - Number of featured jobs (default: 6)

**Example Request:**
```bash
curl "http://localhost:3000/api/jobs/featured?limit=6"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 456,
      "jobTitle": "Marketing Manager",
      "description": "Lead our marketing team...",
      "category": "Sales & Marketing",
      "company": "Growth Inc",
      "emailInfo": "hr@growth.com",
      "phoneNumber": "555-9999",
      "jobDate": "2025-10-17T00:00:00.000Z",
      "genderCategory": "Any",
      "companyVerified": true
    }
  ],
  "count": 6
}
```

---

## 4. Get Categories

**Endpoint:** `GET /api/categories`

**Example Request:**
```bash
curl "http://localhost:3000/api/categories"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Technology & IT",
      "count": 89,
      "slug": "technology-it"
    },
    {
      "name": "Accounting & Finance",
      "count": 67,
      "slug": "accounting-finance"
    },
    {
      "name": "Education & Training",
      "count": 52,
      "slug": "education-training"
    }
  ],
  "total": 15
}
```

---

## 5. Advanced Search

**Endpoint:** `POST /api/search`

**Request Body:**
```json
{
  "keyword": "developer",
  "location": "Brooklyn",
  "category": "Technology",
  "genderCategory": "Any",
  "page": 1,
  "limit": 20
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/search" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "developer",
    "location": "Brooklyn",
    "page": 1,
    "limit": 20
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "jobTitle": "Full Stack Developer",
      "description": "Position in Brooklyn...",
      "category": "Technology",
      "company": "Tech Solutions",
      "emailInfo": "jobs@techsolutions.com",
      "phoneNumber": "555-4321",
      "jobDate": "2025-10-16T00:00:00.000Z",
      "genderCategory": "Any",
      "companyVerified": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  },
  "filters": {
    "keyword": "developer",
    "location": "Brooklyn",
    "category": null,
    "genderCategory": null
  }
}
```

---

## 6. Get Statistics

**Endpoint:** `GET /api/stats`

**Example Request:**
```bash
curl "http://localhost:3000/api/stats"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 473,
    "totalCompanies": 142,
    "recentJobs": 85,
    "jobsThisWeek": 23,
    "categoryBreakdown": [
      {
        "category": "Technology & IT",
        "count": 89
      },
      {
        "category": "Accounting & Finance",
        "count": 67
      },
      {
        "category": "Education & Training",
        "count": 52
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid job ID"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Job not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to fetch jobs",
  "message": "Database connection error"
}
```

---

## Frontend Integration Examples

### Fetch Jobs with React
```javascript
const fetchJobs = async (page = 1) => {
  try {
    const response = await fetch(`/api/jobs?page=${page}&limit=20`);
    const data = await response.json();
    
    if (data.success) {
      setJobs(data.data);
      setPagination(data.pagination);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};
```

### Search Jobs
```javascript
const searchJobs = async (keyword, location) => {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        location,
        page: 1,
        limit: 20
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setSearchResults(data.data);
    }
  } catch (error) {
    console.error('Error searching jobs:', error);
  }
};
```

---

## Rate Limiting

Currently, there are no rate limits. Will be implemented in production.

## Authentication

Public endpoints - no authentication required yet. Will be added for job posting and user management.

## CORS

CORS is enabled for all origins in development. Will be restricted in production.

---

**Last Updated:** October 17, 2025
