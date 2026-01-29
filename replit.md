# EnviroSense (ZUBOX)

## Overview

EnviroSense is a location-based environmental awareness and sustainability web application. It provides users with tools to check air quality by ZIP code, get personalized plant recommendations, calculate solar energy savings, visualize regional heat maps, and assess brand environmental impact scores.

The application follows a full-stack TypeScript architecture with a React frontend and Express backend, using PostgreSQL for data persistence and in-memory mock data for demonstration purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom nature-inspired dark theme (deep forest greens)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Charts**: Recharts for data visualization (brand scores, solar savings)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Request Validation**: Zod schemas for input validation
- **Storage Layer**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Schema Sync**: `drizzle-kit push` for database migrations
- **Current State**: Uses mock in-memory data; database schema defined but data seeded programmatically

### Shared Code
- **Location**: `shared/` directory contains code used by both frontend and backend
- **Routes Definition**: `shared/routes.ts` defines API endpoints with Zod schemas for type-safe API contracts
- **Schema Types**: `shared/schema.ts` exports TypeScript types derived from Drizzle table definitions

### Key Design Decisions

1. **Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories enables code sharing and simplified deployment

2. **Type-Safe API Contracts**: Zod schemas in `shared/routes.ts` provide runtime validation and TypeScript type inference for both client and server

3. **Abstract Storage Pattern**: The `IStorage` interface allows swapping between mock data and real database without changing business logic

4. **Component Library**: shadcn/ui provides accessible, customizable components that integrate well with Tailwind CSS

5. **Path Aliases**: TypeScript path aliases (`@/`, `@shared/`) simplify imports and maintain clean code organization

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Database toolkit for queries and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Frontend Libraries
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **recharts**: Charting library
- **wouter**: Client-side routing
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for form validation

### UI Components (Radix UI)
- Dialog, Dropdown Menu, Select, Tabs, Toast, Tooltip, and many more accessible primitives

### Build & Development
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Replit integration (dev only)