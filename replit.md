# Arena AI by GigaRev

## Overview

Arena AI is an AI-powered sales training and roleplay platform designed for door-to-door sales teams. It enables sales representatives to practice objection handling, complete structured training chapters, and track their performance through interactive roleplays. The platform features role-based dashboards for reps, managers, and directors to monitor team progress, certification status, and training analytics. The business vision is to revolutionize sales training, providing an efficient and scalable solution to improve sales effectiveness and reduce ramp-up time for new hires.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS v4 with shadcn/ui (New York style)
- **Animations**: Framer Motion
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints (`/api/*`)

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema**: Shared `shared/schema.ts`
- **Migrations**: Drizzle Kit

### Key Features
- **Authentication**: JWT-based with role-based access control (Reps, Managers, Directors).
- **Onboarding**: First-time user flow for name, photo, and AI-generated warrior avatar.
- **Training Chapters**: Structured modules (e.g., Intro, Sales Foundations, Field Execution) with slides, quizzes, and embedded roleplays.
- **AI Roleplays**: Interactive AI conversation scenarios with varying difficulty and objection types, supporting both text and voice.
- **Battlecards**: Quick reference scripts for objection handling.
- **Progress Tracking**: Monitors chapter completion, roleplay attempts, and quiz scores.
- **User Management**: Creation, deletion, and updates of users with auto-generated passwords and credential delivery via email/SMS.
- **Manager Dashboard**: Features for adding reps, managing teams, resetting passwords, and viewing team performance.
- **Admin Dashboard**: Features for bulk user creation, organization-wide user management, and usage/billing oversight.
- **Quiz System**: Comprehensive quiz review, retake functionality, and a reminder system for certification.
- **Usage & Billing**: Tracks voice roleplay session duration and calculates costs at $0.15/minute, rounded up to the nearest minute.

### Design Patterns
- **Dashboard Certification Guidance**: Visual panels, CTAs, and progress bars guiding users towards certification.
- **Learning Experience**: Interactive chapter pages with progress indicators, expandable objectives, and robust data handling.

## External Dependencies

- **PostgreSQL**: Primary database.
- **Drizzle ORM**: Database toolkit.
- **@tanstack/react-query**: Frontend server state management.
- **shadcn/ui**: UI component library.
- **Framer Motion**: UI animations.
- **Lucide React**: Icon library.
- **Wouter**: Client-side router.
- **Zod**: Runtime type validation.
- **Vite**: Frontend build tool.
- **esbuild**: Backend bundling.
- **tsx**: TypeScript execution for development.
- **@replit/vite-plugin-* (runtime-error-modal, cartographer, dev-banner)**: Replit-specific development plugins.
- **VAPI AI**: Voice AI integration for realistic roleplay (SDK: `@vapi-ai/web`).
- **Cloudinary**: Image storage for user photos and avatars.
- **Resend**: Email service for transactional emails.
- **Twilio**: SMS service for notifications and credential delivery.
- **Gemini AI**: Used for generating warrior avatars and evaluating roleplay performance.