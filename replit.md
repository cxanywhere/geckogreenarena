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