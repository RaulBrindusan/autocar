# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Production server
npm start

# Lint code
npm run lint
```

**Note**: No test framework is currently configured. If tests are needed, check with the user for their preferred testing setup. Playwright is available as a dependency for potential E2E testing.

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and Turbopack for development
- **React 19** with TypeScript for type safety
- **Supabase** for authentication, database (PostgreSQL), and real-time features
- **Tailwind CSS v4** for styling
- **Zod** with React Hook Form for form validation

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature (auth, home, layout, ui)
- `src/lib/` - Utilities, Supabase configuration, and database types
- `database/schema.sql` - Complete database schema with RLS policies
- `middleware.ts` - Authentication middleware for route protection

### Database Tables
- **users** - Extended user profiles linked to Supabase auth
- **car_requests** - Car import requests with detailed specifications
- **cost_estimates** - Saved cost calculations from the calculator
- **openlane_submissions** - OpenLane auction link submissions

All tables use Row Level Security (RLS) with proper access policies.

### Authentication Flow
Uses Supabase Auth with automatic user profile creation via database triggers. Protected routes handled by middleware.ts.

### API Routes
- `/api/cars/makes` - Car manufacturers list
- `/api/cars/models` - Car models by manufacturer  
- `/api/scrape-openlane` - OpenLane data extraction (30s timeout)
- `/api/car-requests` - Handle car import requests submission
- `/api/email/*` - Email notification endpoints (car-request, openlane, test)
- `/api/debug/*` - Development debugging endpoints

### Key Components
- **CarSelectionForm** - Multi-step car selection with API integration
- **CostEstimator** - Real-time cost calculation with Romanian tax logic
- **OpenLaneForm** - OpenLane URL submission with validation
- **AuthForm** - Login/signup with Supabase integration
- **AdminDashboard** - Admin interface for managing requests and users
- **CarDataDisplay** - Shows fetched car information from APIs

## Development Workflow

### Environment Setup
Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ACCESS_TOKEN=your_personal_access_token (for MCP)
SUPABASE_PROJECT_REF=your_project_reference (for MCP)
BREVO_API_KEY=your_brevo_api_key (for email notifications)
```

### Database Changes
When modifying the database:
1. Update `database/schema.sql` with new SQL
2. Apply changes in Supabase SQL editor
3. Regenerate TypeScript types if needed
4. Update RLS policies for new tables/columns

### Supabase Integration
The project uses Supabase SSR package for server-side rendering compatibility. Client configurations are in `src/lib/supabase/`:
- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components and API routes
- `middleware.ts` - Middleware helper for authentication

### MCP Server Integration
Configured for AI assistant interactions with Supabase. The `.mcp.json` file contains server configuration for Claude Desktop integration.

## Coding Conventions

### Component Structure
- Use functional components with hooks
- TypeScript interfaces for all props
- Organize components by feature in subdirectories
- Use Tailwind classes for styling

### Form Handling
- React Hook Form with Zod validation schemas
- Custom form components in `src/components/ui/`
- Handle loading states and error messages consistently

### Database Operations
- Use Supabase client methods, not raw SQL in components
- Always handle RLS policy errors gracefully
- Type database operations with generated TypeScript types

### Security Practices
- Never expose sensitive data in client components
- Use RLS policies for data access control
- Validate all user inputs with Zod schemas
- Handle authentication state properly in middleware

## Romanian Market Context

This application is specifically built for the Romanian car import market. Forms and user-facing text are in Romanian. Cost calculations include Romanian-specific taxes and import fees.

### Email Integration
Uses Brevo (formerly SendinBlue) for transactional emails:
- Car request notifications
- OpenLane submission confirmations
- Debug/testing endpoints available

## Current Development Rules

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan
4. Then, begin working on the todo items, marking them as complete as you go
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information

### Security Review Process
After completing any work, check through all code to ensure:
- No sensitive information exposed in frontend
- No exploitable vulnerabilities
- Proper input validation and sanitization
- Correct RLS policy implementation

### Learning Review Process
When requested, explain functionality and code changes in detail, walking through what was changed and how it works, acting like a senior engineer teaching code.