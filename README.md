# JobPilot AI

An AI-powered career intelligence platform that helps software engineers organize job applications, compare resumes against job descriptions, identify evidence gaps, and prepare for interviews.

Built as a modern full-stack application to demonstrate production-ready architecture using React, Next.js, AWS, Supabase, OpenAI, and serverless computing.

---

## Demo

Check out the demo: https://youtu.be/bDRZiAUhdf4

https://jobpilot-ai-rouge.vercel.app

---

## Features

### Authentication

- Secure email/password authentication
- Supabase Authentication
- Session persistence
- Protected application pages

### Resume Management

- Upload PDF resumes
- Automatic resume text extraction
- Resume storage in Amazon S3
- Previous resume automatically replaced when uploading a new version

### AI Resume Analysis

Compare your resume against any job posting and receive:

- Match score
- Strong evidence
- Partial evidence
- Missing evidence
- Resume improvement suggestions
- Skills to learn
- Interview questions

### Job Tracker

- Save job postings
- Track application status
- Store notes
- Manage interview pipeline

### Dashboard

View:

- Total jobs
- Applications
- Interviews
- Offers
- Average AI match score
- Highest matching opportunity
- Resume gap statistics

---

# Architecture

```
                React / Next.js
                      │
          ┌───────────┴───────────┐
          │                       │
    Supabase Auth          Next.js API Routes
          │                       │
          │                       │
      PostgreSQL             AWS Lambda
          │                       │
          │                 OpenAI Responses API
          │                       │
          └───────────┬───────────┘
                      │
                 Amazon S3
              Resume Storage
```

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- AWS Lambda
- Node.js

### Database

- Supabase PostgreSQL

### Authentication

- Supabase Auth

### AI

- OpenAI Responses API

### Cloud

- Amazon S3
- AWS Lambda
- AWS Secrets Manager

### Deployment

- Vercel

---

# AWS Services Used

## AWS Lambda

AI analysis is executed inside an AWS Lambda function rather than directly inside the web application.

Benefits:

- Serverless compute
- Isolated AI execution
- Easily scalable
- Keeps OpenAI logic outside the frontend

---

## Amazon S3

Uploaded resumes are securely stored inside Amazon S3.

Each uploaded resume:

- stored as a PDF
- automatically replaces the previous version
- remains separate from extracted resume text

---

## AWS Secrets Manager

The OpenAI API key is stored securely in AWS Secrets Manager instead of hardcoded environment variables.

The Lambda retrieves the key securely during execution.

---

# Project Structure

```
src/
 ├── app/
 │    ├── auth/
 │    ├── dashboard/
 │    ├── jobs/
 │    ├── profile/
 │    ├── api/
 │    │      └── resume-upload/
 │
 ├── components/
 ├── lib/

aws/
 └── analyze-job/
      ├── handler.ts
      ├── openai.ts
      ├── prompts.ts
      ├── secrets.ts
      └── types.ts
```

---

# Local Development

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

---

# Environment Variables

### Frontend

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_RESUME_BUCKET=
ANALYZE_LAMBDA_NAME=
```

### AWS Secrets Manager

```
OPENAI_API_KEY
```

---

# Future Improvements

- Resume version history
- Chrome extension to import jobs directly from LinkedIn
- AI-generated cover letters
- Resume tailoring assistant
- Analytics dashboard
- Email reminders for follow-ups
- Interview calendar integration
- Multi-resume support
- Recruiter CRM
- Job search insights

---

# Why I Built This

Most job trackers only organize applications.

JobPilot AI focuses on improving the quality of applications by using AI to identify resume evidence gaps, recommend improvements, and help engineers prepare for interviews while keeping resumes securely stored in AWS.

The project was also an opportunity to build a production-style application that combines modern frontend development with cloud infrastructure and serverless architecture.

---

# Skills Demonstrated

- React
- Next.js
- TypeScript
- Tailwind CSS
- AWS Lambda
- Amazon S3
- AWS Secrets Manager
- Supabase Authentication
- PostgreSQL
- REST APIs
- OpenAI API Integration
- Serverless Architecture
- Cloud Storage
- Full Stack Development
