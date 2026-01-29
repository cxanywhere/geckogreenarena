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
  - **Chapter 0 (Intro to GeckoGreen)**: 40 slides covering company intro, services, certification path, professional standards, team culture, lawn care fundamentals, and program details. Uses AI-generated portrait (9:16) images stored in `public/uploads/chapter0-slides/`
  - **Chapter 1 (Sales Foundations)**: 31 slides with quizzes and roleplays on first impressions and objection handling
  - **Chapter 2 (Field Execution)**: 38 slides with advanced sales techniques and closing strategies
- **Roleplays**: AI conversation scenarios with difficulty stats
- **Battlecards**: Quick reference scripts for handling objections
- **UserProgress**: Tracks chapter completion and roleplay attempts
- **RoleplayAttempts**: Stores roleplay session results and scores
- **Experts**: D2D sales coaches with pricing tiers for AI coaching, consultations, call reviews

### Authentication
- JWT-based authentication with 7-day token expiry
- Login returns authToken stored in localStorage alongside user data
- Authorization header (Bearer token) required for protected endpoints
- getAuthenticatedUser helper validates JWT and extracts user info
- Role-based routing (rep → dashboard, manager → manager-dashboard, director → admin-dashboard)

### Route Protection (client/src/components/protected-route.tsx)
- ProtectedRoute component wraps dashboard routes to enforce role-based access
- Checks AuthContext for user and role before rendering protected pages
- Redirects unauthenticated users to /login
- Redirects users with wrong role to their correct dashboard
- Role mapping: rep → /dashboard, manager → /manager-dashboard, admin/director → /admin-dashboard
- All dashboard and training routes are protected with appropriate allowedRoles

### First-Time User Onboarding
- Users with status "onboarding" are redirected to `/onboarding` after login
- Onboarding flow allows users to:
  1. Edit their name
  2. Take a photo with camera or upload from device
  3. Generate a warrior-themed avatar using Gemini AI
- Original photo and warrior avatar are stored in Cloudinary
- User status changes to "active" after completing onboarding
- Warrior avatar is displayed in nav and profile areas

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

## User Management System

### Password Generation (server/password-generator.ts)
- Cryptographically secure using `crypto.randomInt`
- Format: `AdjectiveNoun####!@` (word + word + 4 digits + 2 special chars)
- ~1 billion possible combinations for security

### User Management API (server/routes.ts)
- `POST /api/users`: Create user with auto-generated password (returns credentials for display)
- `DELETE /api/users/:id`: Remove user from system
- `PATCH /api/users/:id`: Update user status/details
- `GET /api/managers`: List all managers
- `GET /api/reps`: List all sales reps
- `GET /api/users/:userId/progress-summary`: Get user's training progress stats
- `POST /api/send-credentials/email`: Send login credentials via email

### Email Integration (server/email-service.ts)
- Resend integration for transactional emails
- `sendCredentialsEmail()`: Welcome email with login credentials
- `sendPasswordResetEmail()`: Password reset flow

### SMS Integration (server/sms-service.ts)
- Twilio integration for SMS notifications
- `sendCredentialsSMS()`: Send login credentials via text message
- API endpoint: `POST /api/send-credentials/sms`

### Manager Dashboard Features
- Add new reps with auto-generated passwords
- Phone field for SMS (future Twilio integration)
- Credentials display with copy-to-clipboard
- Send credentials via email button
- Team filtering by manager ID

### Admin Dashboard Features
- Add new managers with auto-generated passwords
- **Bulk Add Reps**: Add hundreds of reps at once via text input (name, email per line)
  - Select manager to assign reps to
  - Auto-generate secure passwords for each rep
  - Optional welcome email with login credentials
  - CSV download of results with passwords
  - Shows success/failed counts with error reasons
- View all managers and reps across organization
- Remove users with confirmation
- Usage & Billing tab with detailed cost tracking

### Bulk User Creation API
- `POST /api/users/bulk`: Create multiple reps in one request
  - Request body: `{ managerId, users: [{name, email}], sendEmails: boolean }`
  - Validates email format and checks for duplicates
  - Returns success/failed arrays with passwords and email status

## Usage Tracking & Billing System

### Database Model (shared/schema.ts)
- **usageSessions**: Tracks each voice roleplay session with:
  - `userId`, `roleplayId`, `vapiCallId` - session identification
  - `startTime`, `endTime`, `durationSeconds` - timing data
  - `billedMinutes` - rounded up to nearest minute
  - `rateCentsPerMinute` - billing rate (default: 15 cents)
  - `costCents` - calculated cost (billedMinutes × rate)
  - `status` - active, completed, or cancelled

### Billing Calculation
- Rate: $0.15 per minute for voice roleplay sessions
- Duration rounded up to nearest minute (e.g., 45 seconds = 1 minute)
- Cost = billedMinutes × 15 cents

### Usage API Endpoints (server/routes.ts)
- `POST /api/usage/register-session`: Create usage session when call starts
- `GET /api/usage/user/:userId`: Get user's usage and cost summary
- `GET /api/usage/team/:managerId`: Get team usage for managers
- `GET /api/usage/all`: Get all usage for admins

### Integration Points
- **VoiceRoleplay.tsx**: Registers usage session when call starts (includes userId)
- **POST /api/vapi/evaluate**: Completes usage session with duration and cost calculation
- **Admin Dashboard**: Usage & Billing tab shows total sessions, minutes, cost, and per-user breakdown
- **Manager Dashboard**: Team Usage tab shows team's sessions, minutes, cost, and per-rep breakdown

### Access Control
- Sales reps: Can see their training progress (no billing info)
- Managers: Can see their team's usage and costs
- Admins/Directors: Can see all organization usage and costs