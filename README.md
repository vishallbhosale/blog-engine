# Dynamic Blog Engine

A full-stack blog application built using **Next.js 15**, **Prisma ORM**, **PostgreSQL**, **Tailwind CSS**, and **TypeScript** as part of a Full Stack Development Internship Technical Assessment.

## 🌐 Live Demo

[View Live Website](https://blog-engine-lemon.vercel.app)

## 💻 GitHub Repository

https://github.com/vishallbhosale/blog-engine

---

## Features

* Create blog posts
* Dynamic slug generation
* Duplicate title support (`-2`, `-3`, ...)
* Responsive UI
* Client-side validation
* Server-side validation using Zod
* REST APIs
* Prisma ORM
* PostgreSQL database
* Dynamic routing
* Custom 404 page

---

## Tech Stack

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Prisma ORM
* PostgreSQL
* Zod

---

## Project Structure

```text
src/
 ├── app/
 │    ├── api/posts/
 │    ├── blog/
 │    └── page.tsx
 │
 ├── components/
 │      BlogForm.tsx
 │
 ├── lib/
 │      prisma.ts
 │      slug.ts
 │      validation.ts
 │
 └── types/
```

---

## Database Schema

```prisma
model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  image       String
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go inside the project:

```bash
cd blog-engine
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

Example:

```env
DATABASE_URL="your_database_url"
```

---

## Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

---

## Run

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## API Endpoints

### Create Post

```
POST /api/posts
```

Request:

```json
{
  "title": "Introduction to Next.js",
  "image": "https://example.com/image.jpg",
  "description": "Blog description"
}
```

---

### Get Post

```
GET /api/posts/[slug]
```

Example:

```
GET /api/posts/introduction-to-nextjs
```

---

## Slug Generation

Examples:

```
Introduction to Next.js
↓
introduction-to-nextjs
```

Duplicate titles:

```
Introduction to Next.js
↓
introduction-to-nextjs

Introduction to Next.js
↓
introduction-to-nextjs-2

Introduction to Next.js
↓
introduction-to-nextjs-3
```

---

## Author

Vishal Bhosale
