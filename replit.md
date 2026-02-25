# Arena by GigaRev — MarketStar Sales Training Platform

## Overview

Arena by GigaRev is an AI-powered B2B sales training and roleplay platform, customized for MarketStar (www.marketstar.com). It enables sales representatives to practice enterprise buyer objection handling, complete structured training chapters on MarketStar's B2B sales outsourcing solutions, and track their performance through interactive roleplays. MarketStar is the global leader in B2B sales outsourcing (founded 1988, nearly 40 years, PEAK Matrix® Leader 2025, 4 Stevie Awards 2025, 3,950 employees across 90+ countries, Keith Titus CEO, Paul Grant COO). The platform features role-based dashboards for reps, managers, and directors to monitor team progress, certification status, and training analytics. Brand colors: deep blue (#1A2B8C) and orange (#E07A2F). The app name is "Arena" by "GigaRev", deployed for client "MarketStar". The top nav displays both logos: Arena (primary) and MarketStar (client).

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
- **Brand Colors**: Navy blue #1A2B8C (CSS var `navy`, HSL 230 72% 22%), MarketStar Orange #E07A2F (CSS var `magenta`, HSL 24 78% 53%). Nav uses navy bg with white text and orange accents. Orange is the primary accent for buttons, CTAs, progress bars, active states. Gradient buttons use `btn-gradient` class (orange→navy). Colors aligned with MarketStar.com brand identity.

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
- **Training Chapters**: 12 structured modules covering MarketStar's full solution portfolio (MarketStar 101, Buyer Reality & ICP, Sales as a Service®, Pipeline Generation, New Business Acquisition, Account Management, Partner Channel Services, Customer Success, Revenue Operations, Competitive Differentiation, Deal Execution, AI Enablement).
- **AI Roleplays**: 24 interactive AI conversation scenarios covering MarketStar sales situations (discovery, demo, pricing, closing, partner channels, customer success, Nytro.ai), supporting both text and voice.
- **Buyer Personas**: 13 enterprise buyer personas (VP Sales, CRO, CEO, VP Partnerships, VP Customer Success, CFO, etc.) with detailed attributes and selling strategies.
- **Battlecards**: 20 quick reference scripts for B2B sales outsourcing objection handling across Discovery, Demo, Objection Handling, Pricing, Closing, and Follow-up phases.
- **Knowledge Base**: 55+ entries covering MarketStar solutions, MEDDPICC sales methodology, enterprise objection handling, pricing, competitive intelligence, and Nytro.ai.
- **Progress Tracking**: Monitors chapter completion, roleplay attempts, and quiz scores.
- **User Management**: Creation, deletion, and updates of users with auto-generated passwords and credential delivery via email/SMS.
- **Manager Dashboard**: Features for adding reps, managing teams, resetting passwords, and viewing team performance.
- **Admin Dashboard**: Features for bulk user creation, organization-wide user management, and usage/billing oversight.
- **Quiz System**: Comprehensive quiz review, retake functionality, and a reminder system for certification.
- **Usage & Billing**: Tracks voice roleplay session duration and calculates costs at $0.15/minute, rounded up to the nearest minute.

### Sales Context
- **Company**: MarketStar — Global leader in B2B sales outsourcing (founded 1988, HQ Ogden UT, privately held, Wasatch Equity Group investor)
- **Leadership**: Keith Titus (President & CEO), Paul Grant (COO)
- **Core Solutions**: Demand Generation, Direct Sales (Pipeline Generation/SDR, New Business Acquisition/AE, Account Management), Partner Channel Services, Customer Success, Revenue Operations, Sales as a Service®
- **MarketStar Labs**: Nytro.ai (AI pitch intelligence — Upload→Score→Improve for sales onboarding & readiness) + Gameplan (training & mentorship platform)
- **Target Buyers**: VP Sales, CRO, CEO, VP Partnerships, VP CS, CFO at $50M-$5B B2B tech companies
- **Competitors**: Tier 1: Accenture (acquired N3), TTEC, Teleperformance, Concentrix. Tier 2: CIENCE, Martal Group, Belkins, EBQ. Internal hiring.
- **Value Prop**: Nearly 40 years B2B tech specialization, 3,950 employees across 90+ countries, 6-8 week ramp, PEAK Matrix® Leader 2025, 4 Stevie Awards 2025
- **Sales Methodology**: MEDDPICC
- **Core Values ("Live the Six")**: You Belong, All In Everyday, Leaders Who Amplify, Masters of Our Craft, We Care, Creativity That Impacts
- **Market**: B2B sales outsourcing $105B (2024) → $216B by 2033 at 9.78% CAGR

### Design Patterns
- **Dashboard Certification Guidance**: Visual panels, CTAs, and progress bars guiding users towards certification.
- **Learning Experience**: Interactive chapter pages with progress indicators, expandable objectives, and robust data handling.

## Important Files
- **Seed Data (active)**: `server/seed-data-new.ts` — imported by `server/seed.ts`, contains CHAPTER_SEED_DATA and ROLEPLAY_SEED_DATA
- **Seed Data (legacy)**: `server/seed-data.ts` — buyer personas and battlecards data, not used for chapter/roleplay seeding
- **Knowledge Base**: `server/knowledge-base.ts` — MarketStar solution knowledge entries
- **VAPI Config**: `server/vapi-config.ts` — Voice roleplay scenario configurations
- **Playbook**: `server/playbook-seed-data.ts` — Victory playbook comic stories
- **Mock Data**: `client/src/lib/mock-data.ts` — Client-side battlecards, personas, resources

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

### AI-Generated Media
- **Slide Images**: 64/64 slides have AI-generated presentation images via Gemini (`gemini-3-pro-image-preview`). MarketStar brand colors: navy #1A2B8C background, orange #E07A2F accents, white text. Images stored in `public/uploads/slides/`.
- **Narration Audio**: 64/64 slides have AI-generated voiceover narration. Scripts generated via GPT-4o-mini, audio via Gemini TTS (`gemini-2.5-flash-preview-tts`, Orus voice). Audio files stored as WAV in `public/uploads/narration/`.
- **Generation Endpoints**: Individual slide image: `POST /api/chapters/:id/generate-slide/:slideIndex`. Individual slide narration: `POST /api/chapters/:id/generate-narration/:slideIndex`. Batch narration: `POST /api/chapters/:id/generate-narration`. Clear all media: `POST /api/chapters/clear-all-media`.
- **Seed Data Preservation**: `server/seed.ts` preserves existing imageUrl/narrationScript/narrationAudioUrl from DB on restart (safe to restart server without losing generated media).

## Recent Changes
- Fully rebranded from Monetate to MarketStar (www.marketstar.com) across all content
- Replaced all Monetate product references (Symphony, Maestro, Overture, MONET, Concierge) with MarketStar solutions (Sales Solutions, Partner Channel, Customer Success, Revenue Operations, Nytro.ai, Sales as a Service®)
- Restructured training from 3 chapters to 12 chapters covering MarketStar's complete solution portfolio
- Expanded roleplays from 16 to 24 scenarios covering all MarketStar solution areas
- Updated all buyer personas, battlecards, knowledge base entries, AI prompts, email/SMS templates, and quiz content
- Updated competitive landscape from DTC/e-commerce to B2B sales outsourcing market
- Generated all 64 slide images and 64 narration voiceovers for all 12 MarketStar training chapters
- **Feb 2026 Content Refresh**: Updated all content with verified facts from marketstar.com:
  - Fixed stats: 3,950 employees (was 1,600), 90+ countries (was 8), nearly 40 years (was 35+)
  - Fixed Nytro.ai: pitch intelligence for onboarding/readiness (was incorrectly described as real-time call coaching)
  - Added Demand Generation as major solution area
  - Added Gameplan training/mentorship platform (MarketStar Labs)
  - Added 2025 awards: PEAK Matrix® Leader + 4 Stevie Awards
  - Updated competitive intelligence: Accenture (N3 acquisition), CIENCE/Martal/Belkins/EBQ as Tier 2
  - Updated market sizing: $105B (2024) → $216B (2033) at 9.78% CAGR
  - Regenerated 51/64 images and 64/64 narrations (13 images pending Gemini API daily quota reset)
