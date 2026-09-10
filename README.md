# Dynamic Blog Engine

A full-stack blog application built using **Next.js 15**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **Tailwind CSS**, **Zod**, and **Cloudinary** as part of a Full Stack Development Internship Technical Assessment.

## 🌐 Live Demo

[View Live Website](https://blog-engine-lemon.vercel.app)

## 💻 GitHub Repository

[GitHub Repository](https://github.com/vishallbhosale/blog-engine)

---

## Features

* Create blog posts
* Dynamic slug generation
* Duplicate title support (`-2`, `-3`, ...)
* Image upload using Cloudinary
* Image URL support
* Image preview before publishing
* Responsive UI
* Client-side validation
* Server-side validation using Zod
* REST APIs
* Prisma ORM
* PostgreSQL database
* Dynamic routing
* Custom post-not-found UI
* Loading and error handling
* Deployed on Vercel

---

## Tech Stack

* **Next.js 15** - App Router
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Prisma ORM 6.16.2**
* **PostgreSQL**
* **Zod**
* **Cloudinary**
* **Vercel**

---

## Project Structure

```text
blog-engine/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── posts/
│   │   │       ├── route.ts
│   │   │       └── [slug]/
│   │   │           └── route.ts
│   │   │
│   │   ├── blog/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── BlogForm.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── slug.ts
│   │   └── validation.ts
│   │
│   └── types/
│       └── post.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
└── README.md
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

### 1. Clone the repository

```bash
git clone https://github.com/vishallbhosale/blog-engine.git
```

### 2. Go inside the project

```bash
cd blog-engine
```

### 3. Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL="your_database_url"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_cloudinary_upload_preset"
```

### Cloudinary Setup

The project uses Cloudinary for image uploads.

Create an **unsigned upload preset** in your Cloudinary account.

Example:

```text
Upload Preset: blog-engine
Signing Mode: Unsigned
```

The Cloudinary API Secret is **not required on the frontend** and should never be exposed in `NEXT_PUBLIC_` environment variables.

---

## Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Creating a Blog Post

Navigate to:

```text
http://localhost:3000/blog/create
```

The form supports two ways to add an image:

### 1. Image URL

Paste an image URL directly into the Image URL field.

Example:

```text
https://example.com/image.jpg
```

### 2. Cloudinary Upload

Click the **upload icon** on the right side of the Image URL field and select an image from your computer.

The image is uploaded to Cloudinary and the returned URL is automatically added to the Image URL field.

An image preview is also displayed before submitting the blog post.

---

## API Endpoints

### Create Post

```text
POST /api/posts
```

Request:

```json
{
  "title": "Introduction to Next.js",
  "image": "https://example.com/image.jpg",
  "description": "Learn the basics of Next.js and how to build modern web applications."
}
```

Successful response:

```text
201 Created
```

---

### Get Post

```text
GET /api/posts/[slug]
```

Example:

```text
GET /api/posts/introduction-to-nextjs
```

Successful response:

```text
200 OK
```

If the post does not exist:

```text
404 Not Found
```

---

## Validation

The application performs validation on both the client and server.

### Title

* Required
* Minimum 3 characters

### Image

* Required
* Must be a valid URL

### Description

* Required
* Minimum 10 characters

Server-side validation is implemented using **Zod**.

---

## Slug Generation

Blog titles are automatically converted into URL-friendly slugs.

Example:

```text
Introduction to Next.js

↓

introduction-to-nextjs
```

### Duplicate Titles

If the same title is created multiple times:

```text
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

This ensures that every post has a unique URL.

---

## Deployment

The application is deployed using **Vercel**.

Production database:

**PostgreSQL**

Image hosting:

**Cloudinary**

Application hosting:

**Vercel**

Environment variables for production are configured in the Vercel project settings.

---

## Security

* Database credentials are stored in environment variables.
* `.env` is excluded from Git using `.gitignore`.
* Cloudinary API secrets are not exposed to the client.
* Only public Cloudinary configuration values use `NEXT_PUBLIC_`.
* Server-side input validation is implemented using Zod.

---

## Author

**Vishal Bhosale**

Full Stack Development / Computer Engineering Student

---

## License

This project was created as part of a Full Stack Development Internship Technical Assessment.
