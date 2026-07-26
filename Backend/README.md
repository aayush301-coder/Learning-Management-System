# Learning Management System (LMS) Backend

A production-ready backend API for a Learning Management System built using the MERN stack. This backend provides authentication, course management, enrollments, learning progress tracking, reviews, and notifications with a modular feature-based architecture.

---

# 🚀 Features

## Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Role-based authorization
* Protected routes
* Password hashing using bcrypt

Supported roles:

* Student
* Instructor
* Admin

---

# Course Management

Instructor features:

* Create courses
* Update courses
* Delete courses
* Manage course status
* Submit courses for review

Admin features:

* Publish courses
* Archive courses
* Restore courses

Student features:

* Browse published courses
* View course details

---

# Section & Lesson Management

* Create course sections
* Add lessons inside sections
* Organize course content
* Support lesson preview access
* Track lesson ordering

---

# Enrollment System

Students can:

* Enroll in published courses
* View enrolled courses
* Cancel enrollment

Business rules:

* Only students can enroll
* Only published courses can be enrolled
* Duplicate enrollment is prevented

---

# Learning Progress

Tracks:

* Completed lessons
* Last accessed lesson
* Completion percentage
* Course completion status

Progress states:

```
not_started
in_progress
completed
```

---

# Reviews & Ratings

Students can:

* Create course reviews
* Update reviews
* Delete reviews

System supports:

* Duplicate review prevention
* Course rating aggregation
* Review count tracking

---

# Notifications

Supports:

* Enrollment notifications
* User notifications
* Notification management

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JSON Web Token (JWT)
* bcrypt

## Validation

* Zod

## Testing

* Jest
* Supertest

## Other Tools

* Swagger API Documentation
* Winston Logger
* Nodemailer
* Cloudinary
* Razorpay

---

# 📁 Project Architecture

The backend follows a modular feature-based architecture.

```
Backend
│
├── server.js
├── package.json
├── .env
├── .env.example
│
└── src
    │
    ├── app.js
    │
    ├── config
    │   ├── db.js
    │   └── swagger.js
    │
    ├── middlewares
    │   ├── auth.middleware.js
    │   ├── authorize.middleware.js
    │   ├── validate.middleware.js
    │   ├── error.middleware.js
    │   └── rateLimiter.middleware.js
    │
    ├── services
    │   ├── email.service.js
    │   └── cloudinary.service.js
    │
    ├── utils
    │   ├── asyncHandler.js
    │   └── logger.js
    │
    ├── constants
    │
    ├── modules
    │   │
    │   ├── auth
    │   ├── users
    │   ├── courses
    │   ├── sections
    │   ├── lessons
    │   ├── enrollments
    │   ├── progress
    │   ├── reviews
    │   └── notifications
    │
    └── __tests__
        ├── auth.test.js
        ├── course.test.js
        └── enrollment.test.js
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file:

```env
PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string


JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d


MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=email_username
MAIL_PASS=email_password
MAIL_FROM=email_address


CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET


RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

# ▶️ Running the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

# 🧪 Running Tests

Run all tests:

```bash
npm test
```

Run specific test:

```bash
npm test -- course.test.js
```

Current integration tests:

```
Authentication
Course Management
Enrollment Flow
```

---

# 📚 API Documentation

Swagger documentation is available at:

```
/api-docs
```

Example:

```
http://localhost:5000/api-docs
```

---

# 🔑 API Base URL

All APIs use:

```
/api/v1
```

Example:

```
GET /api/v1/courses
```

---

# 📌 Main API Modules

## Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
```

## Courses

```
POST    /api/v1/courses
GET     /api/v1/courses
GET     /api/v1/courses/:courseId
PATCH   /api/v1/courses/:courseId
DELETE  /api/v1/courses/:courseId
```

## Enrollment

```
POST   /api/v1/courses/:courseId/enroll
GET    /api/v1/enrollments/me
DELETE /api/v1/courses/:courseId/enroll
```

## Progress

```
PATCH /api/v1/progress/:courseId/lesson/:lessonId/complete
GET   /api/v1/progress/:courseId
```

## Reviews

```
POST   /api/v1/reviews
PATCH  /api/v1/reviews/:reviewId
DELETE /api/v1/reviews/:reviewId
```

---

# 🔒 Security Features

Implemented:

* JWT authentication
* Password hashing
* Role-based authorization
* Request validation
* Rate limiting
* Centralized error handling
* Secure environment variables

---

# 🧪 Testing Coverage

Current tested flows:

✅ User registration
✅ User login
✅ JWT authentication
✅ Course creation
✅ Course authorization
✅ Course validation
✅ Student enrollment
✅ Duplicate enrollment prevention
✅ Enrollment cancellation
✅ Protected routes

---

# 🚀 Future Improvements

Possible future additions:

* Payment integration
* Video upload system
* Live classes
* Certificates
* Course search optimization
* Advanced analytics dashboard
* Admin dashboard
* Email verification
* Password reset

---

# 👨‍💻 Development Notes

The project follows:

* Feature-based architecture
* Service-controller separation
* Reusable middleware
* Centralized validation
* Modular scalability principles

---

# License

This project is licensed under the MIT License.
