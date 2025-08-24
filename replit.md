# Overview

PLASMA is a modern social media creator platform built with React and Express.js. It enables content creators to share videos, "giigs" (short-form videos), and posts while earning through an innovative energy-based interaction system. Users can boost, resonate with, and amplify content, with creators earning real money based on engagement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**React + TypeScript SPA**: Built with React 18 using TypeScript, implementing client-side routing with wouter for navigation between home feed, creation studio, dashboard, and user profiles.

**Component Library**: Uses shadcn/ui components with Radix UI primitives for consistent design system. Tailwind CSS provides styling with custom "plasma" color scheme (blue, purple, pink) and dark theme.

**State Management**: TanStack React Query handles server state, API requests, and caching. React Hook Form with Zod validation manages form state and validation.

**Media Handling**: Custom video and "giig" (short video) players with controls for play/pause, mute, and fullscreen. Content cards display different media types with interaction buttons.

## Backend Architecture

**Express.js REST API**: Node.js server with Express handling HTTP requests. Structured routes for users, content, interactions, subscriptions, and earnings with proper error handling and logging.

**Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation for development. Includes demo data initialization for testing.

**Type Safety**: Shared TypeScript schemas between client and server using Drizzle-zod for runtime validation and type safety.

## Data Storage Solutions

**Database Schema**: Designed for PostgreSQL with Drizzle ORM. Five main tables:
- Users: profiles, energy levels, earnings, follower counts
- Content: posts, videos, giigs with engagement metrics
- Interactions: user engagement actions (boost, resonance, amplify)
- Subscriptions: creator-subscriber relationships with tiers
- Earnings: monetization tracking with detailed breakdowns

**Session Storage**: Configured for PostgreSQL sessions using connect-pg-simple middleware.

## Authentication and Authorization

**Session-based Auth**: Uses Express sessions with PostgreSQL session store. Cookie-based authentication with credentials included in API requests.

**User Context**: Current user context managed through React Query with user ID passed to API endpoints for authorization.

## External Service Integrations

**Database**: Neon Database (PostgreSQL) for production data persistence with connection pooling via @neondatabase/serverless.

**Development Tools**: 
- Vite for fast development server and building
- Replit integration for cloud development environment
- TypeScript compilation with path mapping for clean imports

**Media Processing**: File upload handling with mock implementation for demonstration. Supports video thumbnails and duration extraction.

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between client and server concerns.