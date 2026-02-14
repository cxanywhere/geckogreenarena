# Monetate Sales Training Platform

## Overview

Monetate Sales Training is an AI-powered B2B SaaS sales training and roleplay platform designed for enterprise sales teams. It enables sales representatives to practice enterprise buyer objection handling, complete structured training chapters on Monetate's experience optimization platform, and track their performance through interactive roleplays. The platform features role-based dashboards for reps, managers, and directors to monitor team progress, certification status, and training analytics. Brand colors: deep blue (#1A2B8C) and magenta (#E84C8A) with a luxury, high-end aesthetic.

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
- **Brand Colors**: Navy blue #1A2B8C (CSS var `navy`, HSL 230 72% 22%), Magenta #E84C8A (CSS var `magenta`, HSL 338 78% 58%). Nav uses navy bg with white text and magenta accents. Magenta is the primary accent for buttons, CTAs, progress bars, active states. Gradient buttons use `btn-gradient` class (magenta→navy).

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
- **Onboarding**: First-time user flow for name, photo, and AI-generated professional avatar.
- **Training Chapters**: Structured modules (Intro to Monetate, Sales Foundations, Deal Execution) with slides, quizzes, and embedded roleplays.
- **AI Roleplays**: 16 interactive AI conversation scenarios covering enterprise buyer objections (discovery, demo, pricing, closing), supporting both text and voice.
- **Buyer Personas**: 13 enterprise buyer personas (VP E-Commerce, CTO, CMO, CFO, etc.) with detailed attributes and selling strategies.
- **Battlecards**: 20 quick reference scripts for enterprise objection handling across Discovery, Demo, Objection Handling, Pricing, Closing, and Follow-up phases.
- **Knowledge Base**: 55 entries covering Monetate product knowledge, MEDDPICC sales methodology, enterprise objection handling, pricing, and competitive intelligence.
- **Progress Tracking**: Monitors chapter completion, roleplay attempts, and quiz scores.
- **User Management**: Creation, deletion, and updates of users with auto-generated passwords and credential delivery via email/SMS.
- **Manager Dashboard**: Features for adding reps, managing teams, resetting passwords, and viewing team performance.
- **Admin Dashboard**: Features for bulk user creation, organization-wide user management, and usage/billing oversight.
- **Quiz System**: Comprehensive quiz review, retake functionality, and a reminder system for certification.
- **Usage & Billing**: Tracks voice roleplay session duration and calculates costs at $0.15/minute, rounded up to the nearest minute.

### Sales Context
- **Product**: Monetate experience optimization platform with personalization, A/B testing, AI recommendations (MONET engine), conversion optimization
- **Target Buyers**: Enterprise B2B SaaS selling to VPs, CTOs, CMOs at e-commerce/retail brands ($50M+ revenue)
- **Competitors**: Dynamic Yield (Mastercard), Optimizely, Adobe Target, Bloomreach
- **Value Prop**: 15% average revenue lift, 3x ROI within 12 months

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
- **Gemini AI**: Used for generating professional avatars, chapter images, and evaluating roleplay performance.

## Recent Changes
- Rebranded from GeckoGreen/Arena AI to Monetate B2B SaaS platform
- Applied luxury deep blue (#1A2B8C) and magenta (#E84C8A) color scheme
- Rewrote all training content from lawn care door-to-door to enterprise B2B SaaS sales
- Updated all 16 roleplays, 13 buyer personas, 20 battlecards, 55 knowledge base entries
- Updated all AI prompts (Gemini, VAPI) for enterprise buyer context
