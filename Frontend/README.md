# Okla — LMS

A full-stack Learning Management System: students browse and enroll in
courses, track lesson-by-lesson progress, leave reviews; instructors
build courses with sections and YouTube-linked lessons; admins review
and publish courses and manage users.

## Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation, Cloudinary uploads.
**Frontend:** React 19, Vite, Tailwind CSS, React Router, React Hook Form + Zod, Axios.

## Project structure

```
Okla/
├── Backend/   Express API (see Backend/.env.example)
└── Frontend/  React app (see Frontend/.env.example)
```

## Running locally

**1. Backend**
```
cd Backend
npm install
cp .env.example .env   # fill in DB_URI, JWT_SECRET, CLOUDINARY_* etc.
npm run dev
```
Runs on http://localhost:3000 by default. Health check: `GET /health`.

**2. Frontend**
```
cd Frontend
npm install
cp .env.example .env   # defaults to http://localhost:3000/api/v1
npm run dev
```
Runs on http://localhost:5173 by default.

Make sure `CLIENT_URL` in `Backend/.env` matches wherever the frontend
is actually running (defaults to `http://localhost:5173` if not set).

## Roles

Registration only allows `student` or `instructor` — nobody can
self-register as `admin`. To test the admin views, register normally
and then set that user's `role` field to `"admin"` directly in MongoDB.

## Notes

- Course lifecycle: `draft` → `pending_review` (instructor submits) →
  `published` (admin publishes) → `unpublished`/`archived`.
- Lesson videos are YouTube links only — no video upload/hosting.
- No payment system: enrollment in a published course is free and
  immediate.
