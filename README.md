# Skill Gap Analyzer

Real-world **Skill Gap Analyzer** built with:

- **Next.js (App Router) + TypeScript**
- **MySQL + Prisma**
- **Tailwind CSS + shadcn/ui**
- **NextAuth.js**
- **Recharts**

## Setup

### 1) Install

```bash
npm install
```

### 2) Create a MySQL database + user

Make sure your MySQL user uses an auth plugin Prisma supports.

If you hit:

> Unknown authentication plugin `sha256_password`

create a dedicated user with `mysql_native_password` (or update your existing user):

```sql
CREATE DATABASE skill_gap_analyzer;

CREATE USER 'sga'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON skill_gap_analyzer.* TO 'sga'@'localhost';
FLUSH PRIVILEGES;
```

Update `.env`:

```env
DATABASE_URL="mysql://sga:your_password@localhost:3306/skill_gap_analyzer"
```

### 3) Auth env vars

Set:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-to-a-long-random-string"
GITHUB_ID="..."
GITHUB_SECRET="..."
```

### 4) Migrate + seed

```bash
npm run prisma:migrate
npm run db:seed
```

### 5) Run

```bash
npm run dev
```

## App flow

- `/` → landing
- `/sign-in` → GitHub sign-in
- `/roles` → pick a target role
- `/assessment/new?roleId=...` → rate yourself on each skill
- `/dashboard/[assessmentId]` → gap report + chart

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
