# Arena by GigaRev — LinkedIn Marketing Solutions Sales Training Platform

## Overview

Arena by GigaRev is an AI-powered B2B sales training and roleplay platform, customized for LinkedIn Marketing Solutions (LMS). It enables sales representatives to practice B2B advertising buyer conversations, complete structured training chapters on LinkedIn's marketing products and solutions, and track their performance through interactive roleplays. The platform features role-based dashboards for reps, managers, and directors to monitor team progress, certification status, and training analytics. Brand colors: LinkedIn Blue (#0A66C2) and navy (#1A2B8C). The app name is "Arena" by "GigaRev", deployed for client "LinkedIn Marketing Solutions". The top nav displays Arena branding alongside "LinkedIn Marketing Solutions" text.

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
- **Brand Colors**: Navy blue #1A2B8C (CSS var `navy`, HSL 230 72% 22%), LinkedIn Blue #0A66C2 (CSS var `magenta`, HSL 210 90% 40%). Nav uses navy bg with white text and LinkedIn Blue accents. LinkedIn Blue is the primary accent for buttons, CTAs, progress bars, active states. Gradient buttons use `btn-gradient` class. Colors aligned with LinkedIn brand identity.

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
- **Training Chapters**: 3 structured modules covering LinkedIn Marketing Solutions (LMS Fundamentals and Product Landscape, Buyer Conversations Discovery and Positioning, Objections Strategy and Selling with Confidence).
- **AI Roleplays**: 18 interactive AI conversation scenarios covering LMS sales situations (elevator pitch, lead gen forms, objective clarification, format recommendations, metrics, discovery, persona positioning, objection handling, strategy), supporting both text and voice. Dedicated `/roleplays` page with search bar, difficulty/phase/chapter filters, and card grid showing each roleplay's metadata and user progress. Accessible from Practice nav dropdown.
- **Buyer Personas**: 4 B2B marketing buyer personas (Demand Generation Director, VP of Marketing/CMO, ABM/Field Marketing Leader, Performance Marketing Manager) with detailed attributes and selling strategies.
- **Battlecards**: 20 quick reference scripts for LMS objection handling across Discovery, Demo, Objection Handling, Pricing, Closing, and Follow-up phases.
- **Knowledge Base**: 30+ entries covering LMS products, campaign objectives, measurement, discovery framework, competitive positioning, and beginner talk tracks.
- **Progress Tracking**: Monitors chapter completion, roleplay attempts, and quiz scores.
- **User Management**: Creation, deletion, and updates of users with auto-generated passwords and credential delivery via email/SMS.
- **Manager Dashboard**: Features for adding reps, managing teams, resetting passwords, and viewing team performance.
- **Admin Dashboard**: Features for bulk user creation, organization-wide user management, and usage/billing oversight.
- **Quiz System**: Comprehensive quiz review, retake functionality, and a reminder system for certification.
- **Usage & Billing**: Tracks voice roleplay session duration and calculates costs at $0.15/minute, rounded up to the nearest minute.
- **Pitch Practice**: Reps practice presenting client proposal decks with a live AI buyer persona via VAPI voice and get AI evaluation. DB tables: `pitch_decks`, `pitch_deck_slides`, `pitch_sessions`, `pitch_session_feedback`. First deck: HubSpot LinkedIn Ads pilot proposal (25 slides, buyer: Kipp Bodnar, CMO). Seed data in `server/pitch-deck-seed.ts`. Frontend pages: `/pitch-practice` (hub), `/pitch-session/:slug` (live voice practice), `/pitch-results/:id` (evaluation results). VAPI integration: single call across all slides; rep speaks first, AI buyer asks 1-2 contextual questions per slide; mid-call slide context updates via `vapi.send()` `add-message`; per-slide transcript captured and stored; real transcript fed to Gemini evaluation. Pro Pitch mode: narrated slide walkthroughs with Gemini TTS.

### Sales Context
- **Client**: LinkedIn Marketing Solutions — LinkedIn's B2B advertising and demand generation business
- **What LMS Sells**: Access to professional audiences, precision targeting based on business identity, ad formats matched to business objectives, measurement tied to business outcomes
- **Core Products**: Sponsored Content (feed ads), Lead Gen Forms, Messaging Ads, Video Ads, Carousel Ads, Document Ads, Campaign Manager, Business Manager
- **Campaign Objectives**: Brand Awareness, Website Visits, Engagement, Video Views, Lead Generation, Website Conversions
- **Target Buyers**: Demand Gen Directors, VP/CMO Marketing, ABM/Field Marketing Leaders, Performance Marketing Managers at B2B companies
- **Competitors**: Google Ads (search intent), Meta (social), other B2B ad platforms
- **Value Prop**: Professional identity-based targeting, trusted business environment, full-funnel B2B campaign support, measurable pipeline and revenue impact
- **Sales Methodology**: Consultative selling with 7-part discovery framework (Business Goals, Audience, Funnel Gap, Current Motion, Offer/Content, Measurement, Stakeholders)
- **Key Differentiators**: Professional graph targeting (job title, function, seniority, industry, company, skills), ABM capabilities, Lead Gen Forms with pre-filled data

### Design Patterns
- **Dashboard Certification Guidance**: Visual panels, CTAs, and progress bars guiding users towards certification.
- **Learning Experience**: Interactive chapter pages with progress indicators, expandable objectives, and robust data handling.

## Important Files
- **Seed Data (active)**: `server/seed-data-new.ts` — imported by `server/seed.ts`, contains CHAPTER_SEED_DATA and ROLEPLAY_SEED_DATA
- **Seed Data (legacy)**: `server/seed-data.ts` — buyer personas and battlecards data
- **Knowledge Base**: `server/knowledge-base.ts` — LMS product and sales knowledge entries
- **VAPI Config**: `server/vapi-config.ts` — Voice roleplay scenario configurations (18 LMS scenarios)
- **Playbook**: `server/playbook-seed-data.ts` — Victory playbook comic stories
- **Pitch Decks**: `server/pitch-deck-seed.ts` — HubSpot LinkedIn Ads pilot proposal (25 slides)
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
- **Slide Images**: Generated via Gemini (`gemini-3-pro-image-preview`). LinkedIn Blue #0A66C2 accents, clean professional style. Images stored in `public/uploads/slides/`.
- **Narration Audio**: AI-generated voiceover narration. Scripts generated via GPT-4o-mini, audio via Gemini TTS (`gemini-2.5-flash-preview-tts`, Orus voice). Audio files stored as WAV in `public/uploads/narration/`.
- **Generation Endpoints**: Individual slide image: `POST /api/chapters/:id/generate-slide/:slideIndex`. Individual slide narration: `POST /api/chapters/:id/generate-narration/:slideIndex`. Batch narration: `POST /api/chapters/:id/generate-narration`. Clear all media: `POST /api/chapters/clear-all-media`.
- **Seed Data Preservation**: `server/seed.ts` preserves existing imageUrl/narrationScript/narrationAudioUrl from DB on restart (safe to restart server without losing generated media).

## Recent Changes
- **March 2026 Full Rebrand**: Rebranded from MarketStar (B2B sales outsourcing) to LinkedIn Marketing Solutions (B2B advertising/demand generation)
  - Replaced 13 MarketStar chapters with 3 LMS chapters (66 slides total)
  - Replaced 26 MarketStar roleplays with 18 LMS roleplays across all 3 chapters
  - Replaced 13 buyer personas with 4 LMS personas (Demand Gen Director, VP/CMO, ABM Leader, Performance Marketer)
  - Replaced 20 battlecards with LMS objection handling cards
  - Rewrote 30+ knowledge base entries for LMS products and sales methodology
  - Rewrote 18 VAPI voice roleplay configs with LMS scenarios and rubrics
  - Rewrote 9 Victory Playbook comic stories with LMS themes
  - Updated all AI prompts (image generation, roleplay evaluation, quiz generation) for LMS context
  - Updated brand colors from MarketStar Orange to LinkedIn Blue (#0A66C2)
  - Updated all email/SMS templates, UI branding, meta tags
  - Updated client-side quizzes, roleplays, and mock data
  - Generated 66/66 slide images and 66/66 narration audio files for all 3 LMS chapters
