# Node.js Company & User Management Assignment

## Overview

This project implements a basic hierarchy of **Companies** (parent/child) and **Users** assigned to those companies. It provides RESTful APIs to create and manage companies, register users, and perform searches.

The assignment covers:
1. **Company Management** (create, read, hierarchical structure)
2. **User Management** (create, read, link to a company)
3. **Search API** (search by user name/email or company name)

## Features

- **Nested Company Hierarchy**: A company can have zero or more sub-companies (i.e., children).  
- **User Association**: Each user belongs to exactly one company.  
- **Search**: Single endpoint to search for both users and companies.  
- **MongoDB Aggregation**: Meant for efficient search queries (per the assignment).  
- **Validation**: Prevent duplicate user emails, ensure required fields are present, etc.

---

## Tech Stack

- **Node.js** or Bun (JavaScript runtime)
- **Express** (Server framework)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- (Optional) **MongoDB Atlas** for remote hosting

---

## Project Structure

```
.
├── controllers/
│   ├── companyController.js
│   └── userController.js
├── models/
│   ├── companyModel.js
│   └── userModel.js
├── routes/
│   ├── companyRoutes.js
│   └── userRoutes.js
│   └── searchRoutes.js
├── index.js (or app.js / server.js)
├── package.json
├── README.md
└── ...
```

*(Your actual structure may vary.)*

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install Dependencies

```bash
npm install
```
*(Or `yarn install`, depending on your preference.)*

### 3. Environment Variables

Create a `.env` file (or configure environment variables in your hosting service). Typical variables might include:

```
PORT=3000
DB_URI=''
```

For local MongoDB, you could set:
```
MONGO_URI=mongodb://127.0.0.1:27017/myDatabase
```

*(Ensure special characters in your password are URL-encoded if using a remote MongoDB Atlas URL.)*

### 4. Start the Server

```bash
npm start
```
By default, the server listens on `PORT` (e.g., `3000`). Verify in console logs that you see `Server listening on port 3000` and `Connected to MongoDB!`.

---

## API Endpoints

Below are the main endpoints per the assignment PDF. All routes should be prefixed with your base URL, e.g. `http://localhost:3000/`.

### 1. **Company APIs**

| Method | Endpoint                | Description                                                        | Request Body                                                              | Sample Response                                                           |
|--------|-------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------|
| POST   | `/companies`           | **Create a new company**. If `parentCompanyId` is omitted, it's top-level; else it’s a sub-company. | ```json { "name": "ParentCompany", "parentCompanyId": "<optional>" } ``` | ```json { "companyId": "64fe8...", "hierarchyLevel": 1 }```              |
| GET    | `/companies/:companyId`| **Fetch company details**, including sub-companies & associated users. | N/A                                                                       | ```json { "name": "ParentCompany1", "subCompanies": [], "users": [...] }``` |

### 2. **User APIs**

| Method | Endpoint      | Description                                         | Request Body                                                           | Sample Response                                                      |
|--------|--------------|-----------------------------------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------|
| POST   | `/users`      | **Register a new user** under a given company.      | ```json { "name": "John", "email": "john@example.com", "companyId": "..." }``` | ```json { "userId": "64fe8...", "companyId": "...", "role": "..." }``` |
| GET    | `/users/:userId` | **Fetch user details** + the associated company. | N/A                                                                    | ```json { "name":"John","email":"john@example.com","company":{"_id":"..."} }``` |

### 3. **Search API**

| Method | Endpoint        | Description                                                                                             | Query Params          | Sample Response                                                                                                                             |
|--------|-----------------|---------------------------------------------------------------------------------------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | `/search`       | **Search** for users (by name or email) or companies (by name)                                         | `?query=someString`   | If user is found: ```json { "user": { "name": "John", ...}, "company": { "name": "ParentCompany1", ... } }```<br>If company is found: ```json { "company": { "name": "ParentCompany1", "users": [ ... up to 5 ...] } }``` |

**Note**: The exact structure may differ based on your implementation, but the logic is the same.

---

## Validation & Error Handling

- **Missing Required Fields**: Returns 400 with validation error messages.  
- **Duplicate Email**: Returns 400 with a message that the user already exists.  
- **Company Not Found**: Returns 404 if `parentCompanyId` or `companyId` doesn’t exist in the DB.  
- **Generic Server Errors**: Returns 500 for unhandled exceptions.

---

## Testing with Postman

1. **Open Postman** and create a new **Collection** named `NodeAssignment-API`.
2. **Set up an environment** (optional) with the variable:
   - `baseURL` = `http://localhost:3000`
3. **Add Requests** to the collection:
   1. **POST** `/companies` – Create a parent company.
   2. **POST** `/companies` – Create a child company (with `parentCompanyId`).
   3. **GET** `/companies/{{companyId}}` – Get company details.
   4. **POST** `/users` – Create a user under a company (use the `companyId`).
   5. **GET** `/users/{{userId}}` – Get user details.
   6. **GET** `/search?query=...` – Try searching by user name, email, or company name.
4. **Save** each request and test the response.  
5. **Export** the collection via the **•••** (3 dots) → **Export** → `Collection v2.1`.  
6. Share the JSON file along with your submission.

---

## Example Test Flow

1. **Create Parent Company** (no `parentCompanyId`).
2. **Create Child Company** (with parent’s `companyId`).
3. **Check Parent Company** (`GET /companies/{parentId}`) to see the child in `subCompanies`.
4. **Add a User** (`POST /users`) linked to either parent or child `companyId`.
5. **Get User** (`GET /users/{userId}`) to confirm association with the correct company.
6. **Search** by:
   - `query=John` (should see user info + company).
   - `query=ParentCompany1` (should see company info + up to 5 associated users).
7. **Try edge cases** (missing required fields, invalid IDs, duplicate emails, etc.) to confirm correct error messages.

---

---

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:27017`**: Ensure MongoDB is running locally or use a correct MongoDB Atlas URI.  
---

## Conclusion

This assignment demonstrates **CRUD** operations with nested **Company** hierarchy, **User** registration, and a universal **Search** endpoint. With the steps above, you can:

- Set up your environment,
- Run the server,
- Test all endpoints via Postman,
- Provide an exportable Postman collection for review.

**Happy coding!** If you have any further questions or issues, please open a pull request or reach out to the maintainers.