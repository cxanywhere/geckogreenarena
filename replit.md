# Arena AI by GigaRev

## Overview

Arena AI is a sales training and roleplay platform designed for door-to-door sales teams. The application provides an AI-powered training environment where sales representatives can practice handling objections, complete training chapters, and track their performance through interactive roleplays. The platform includes role-based dashboards for sales reps, managers, and directors to monitor team progress and certification status.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for UI transitions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Style**: RESTful JSON endpoints under `/api/*` prefix
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from `dist/public`

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema sync
- **Connection**: Connection pool via `pg` package

### Key Data Models
- **Users**: Sales reps, managers, directors with role-based access
- **Chapters**: Training modules with slides, quizzes, and embedded roleplays
- **Roleplays**: AI conversation scenarios with difficulty stats
- **Battlecards**: Quick reference scripts for handling objections
- **UserProgress**: Tracks chapter completion and roleplay attempts
- **RoleplayAttempts**: Stores roleplay session results and scores

### Authentication
- Simple email/password authentication (stored in database)
- User session stored in localStorage on client
- Role-based routing (rep → dashboard, manager → manager-dashboard, director → admin-dashboard)

### Project Structure
```
client/src/       # React frontend application
  components/     # Reusable UI components
  components/ui/  # shadcn/ui primitives
  pages/          # Route page components
  lib/            # Utilities, API client, mock data
  hooks/          # Custom React hooks
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between frontend/backend
  schema.ts       # Drizzle database schema
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives (via shadcn/ui)
- **framer-motion**: Animation library
- **lucide-react**: Icon library
- **wouter**: Client-side routing
- **zod**: Runtime type validation

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Voice AI Integration (VAPI)
- **@vapi-ai/web**: Client-side SDK for voice calls
- **VAPI API**: Backend integration for starting calls, retrieving transcripts and recordings
- **Voice Roleplays**: Real-time voice conversations with AI homeowner personas
- **Call Recording**: Audio recordings stored by VAPI, URLs returned for playback

## VAPI Voice Roleplay Architecture

### Configuration (server/vapi-config.ts)
- 6 roleplay personas with objections, personality traits, resistance levels
- Dynamic assistant prompts with behavioral guidelines
- Pass/fail criteria for evaluation

### Service (server/vapi-service.ts)
- `startWebCall()`: Creates VAPI web call session
- `getCallDetails()`: Retrieves call status and metadata
- `getCallTranscript()`: Gets transcript and recording URL after call ends
- `endCall()`: Terminates active call

### API Routes (server/routes.ts)
- `GET /api/vapi/configs`: List all roleplay configurations
- `GET /api/vapi/config/:roleplayId`: Get specific config
- `POST /api/vapi/start-call`: Start voice call session
- `GET /api/vapi/call/:callId`: Get call details
- `GET /api/vapi/transcript/:callId`: Get transcript and recording
- `POST /api/vapi/evaluate`: Evaluate call with Gemini AI, store results

### Frontend Components
- `VoiceRoleplay.tsx`: Voice call UI with mic control, live transcript, status management
- `chat.tsx`: Supports both voice and text roleplay modes
- `results.tsx`: Pass/fail badge, audio playback, AI feedback

### Environment Variables
- `VAPI_API_KEY`: Private API key (server-side only)
- `VITE_VAPI_PUBLIC_KEY`: Public key for client SDK

## UX Design Patterns

### Dashboard Certification Guidance
- **How to Get Certified Panel**: Collapsible guide showing 3 requirements (complete chapters, pass roleplays, score 90%+ on quizzes)
- **Next Action CTA**: Prominent banner showing user's next step with direct link to continue
- **Sequential Training Path**: Chapters displayed with step numbers, locked/unlocked states based on prior completion
- **Progress Tracking**: Visual progress bars for chapters and roleplays in header

### Chapter Page Learning Experience
- **Header Progress Pills**: Quick-view badges showing slides viewed, quizzes completed, roleplays done
- **Expandable Objectives Panel**: Toggle to show "What You'll Learn" agenda and "Requirements to Complete" checklist
- **Progress Bar**: Overall chapter completion percentage with real-time updates
- **Defensive Data Handling**: All chapter.agenda and chapter.slides access includes fallback defaults for robustness