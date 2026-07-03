# JobPilot AI

JobPilot AI is an AI-powered career intelligence platform that helps software engineers track job applications, analyze resume-to-job fit, identify evidence gaps, and prepare for interviews.

The project is designed as a production-quality full-stack application, not a basic CRUD portfolio app.

## Live Demo

jobpilot-ai-rouge.vercel.app

## Tech Stack

### Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js Route Handlers
- OpenAI API

### Database
- Supabase
- PostgreSQL

### Deployment
- Vercel

## Features

### Job Tracking
Users can create, edit, delete, and track job applications through statuses such as:

- Saved
- Tailored
- Applied
- Recruiter Screen
- Technical Interview
- Offer
- Rejected

### Resume Profile
Users can save a master resume profile including:

- Name
- Target role
- Skills
- Resume text

### AI Job Fit Analysis
For each job, users can paste a job description and generate an AI analysis comparing the role against their master resume.

The AI returns:

- Match score
- Strong evidence
- Partial evidence
- Evidence gaps
- Honest resume optimization suggestions
- Skills to learn
- Interview questions

The system is intentionally designed to avoid fabricating experience. If a skill is not supported by the resume, it is labeled as an evidence gap or learning opportunity.

### Dashboard Analytics
The dashboard displays:

- Total jobs
- Applied jobs
- Interviewing jobs
- Offers
- Average fit score
- Highest match
- Jobs needing resume work
- Tailored applications

## Product Philosophy

JobPilot AI is built around evidence-based resume optimization.

Instead of generating fake experience, the platform helps users understand:

- What their resume already proves
- Where their experience partially aligns
- Which requirements are missing
- How to improve resume positioning honestly
- What skills to learn next

## Screenshots

![Landing Page](./screenshots/landing.png)
![Dashboard](./screenshots/dashboard.png)
![Jobs Page](./screenshots/jobs.png)
![Job Details](./screenshots/job-details.png)
![AI Analysis](./screenshots/ai-analysis.png)


## Local Setup

Clone the repository:

git clone https://github.com/samrithab/jobpilot-ai.git
cd jobpilot-ai

Install dependencies:

npm install

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

Run the development server:

npm run dev

Open:

http://localhost:3000
Deployment

The application is deployed on Vercel.

Environment variables required in Vercel:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- OPENAI_API_KEY

## Future Roadmap

Phase 2: AWS Architecture

Planned AWS extensions:

AWS Lambda for serverless AI processing
AWS Cognito for authentication
S3 for resume uploads
CloudWatch for observability
EventBridge for asynchronous AI workflows
Possible CI/CD pipeline with GitHub Actions

Future architecture:

Next.js Frontend
      ↓
AWS Cognito
      ↓
API Route / Lambda
      ↓
OpenAI API
      ↓
Supabase / PostgreSQL
      ↓
S3 Resume Storage
Resume Positioning

## This project demonstrates:

Full-stack product development
Modern React and Next.js architecture
TypeScript engineering
PostgreSQL data modeling
Supabase integration
AI API integration
Prompt engineering
Structured JSON AI responses
Production deployment
Product thinking around responsible AI use

## Architecture

```text
User
 ↓
Next.js Frontend
 ↓
Next.js Route Handler
 ↓
OpenAI API
 ↓
Supabase / PostgreSQL
 ↓
Persistent Job + AI Analysis Data


AI Flow

Master Resume + Skills + Target Role
              ↓
        Job Description
              ↓
       OpenAI Analysis
              ↓
Structured JSON Response
              ↓
Saved to PostgreSQL
              ↓
Displayed in Job Details + Dashboard

Database Schema

profiles

id uuid primary key
name text
target_role text
skills text
resume_text text
created_at timestamp

jobs

id uuid primary key
company text
position text
job_url text
status text
location text
notes text
job_description text
match_score integer
strengths jsonb
partial_evidence jsonb
evidence_gaps jsonb
resume_suggestions jsonb
skills_to_learn jsonb
interview_questions jsonb
created_at timestamp
```

## Author

Built by Samritha B.
