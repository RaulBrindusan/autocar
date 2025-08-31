# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
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
- **users** - Extended user profiles linked to Supabase auth with role-based access (user/admin) and ID document tracking
- **car_requests** - Car import requests with detailed specifications and status tracking (pending, in_progress, quoted, completed, cancelled)
- **cost_estimates** - Saved cost calculations from the calculator
- **openlane_submissions** - OpenLane auction link submissions
- **member_requests** - Membership applications with approval workflow
- **member_car_requests** - Comprehensive car import requests for registered members with detailed vehicle specifications, condition tracking, and preference management
- **contracts** - Contract management with digital signature support (prestari servicii type)
- **user_documents** - Document storage with OCR processing capabilities

All tables use Row Level Security (RLS) with proper access policies.

### Authentication Flow
Uses Supabase Auth with automatic user profile creation via database triggers. Protected routes handled by middleware.ts.

### API Routes
- `/api/cars/makes` - Car manufacturers list
- `/api/cars/models` - Car models by manufacturer  
- `/api/scrape-openlane` - OpenLane data extraction (30s timeout)
- `/api/car-requests` - Handle car import requests submission
- `/api/email/*` - Email notification endpoints via Brevo (car-request, member-car-request, openlane, test)
- `/api/admin/*` - Admin-only endpoints (member-requests, documents, user management, send-offer)
- `/api/user/*` - User-specific endpoints (offers, document-status)
- `/api/contracts/*` - Contract management and digital signature endpoints
- `/api/upload-id-document` - ID document upload with OCR processing
- `/api/document-processing-status` - Check OCR processing status
- `/api/debug/*` - Development debugging endpoints (brevo, OCR testing)

### Key Components
- **CarSelectionForm** - Multi-step car selection with API integration
- **CostEstimator** - Real-time cost calculation with Romanian tax logic
- **OpenLaneForm** - OpenLane URL submission with validation
- **AuthForm** - Login/signup with Supabase integration
- **AdminDashboard** - Admin interface for managing requests, users, contracts, and documents
- **CarDataDisplay** - Shows fetched car information from APIs
- **IdDocumentUpload** - ID document upload with OCR processing via Tesseract.js and Azure AI
- **ProgressTracker** - Visual progress tracking for user onboarding
- **NotificationSystem** - Real-time notifications and alerts
- **DigitalSignature** - Canvas-based digital signature capture for contracts

## Development Workflow

### Environment Setup
Required environment variables (see `.env.example` for complete reference):
```
# Core Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ACCESS_TOKEN=your_personal_access_token (for MCP)
SUPABASE_PROJECT_REF=your_project_reference (for MCP)

# Email Configuration (Brevo)
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=contact@automode.ro
EMAIL_TO=contact@automode.ro

# Document Processing (OCR)
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=your_azure_ai_endpoint
AZURE_DOCUMENT_INTELLIGENCE_KEY=your_azure_ai_key

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Optional: Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Optional: Bot Protection (Cloudflare Turnstile)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_site_key
CLOUDFLARE_TURNSTILE_SECRET=your_turnstile_secret_key

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://automode.ro
NODE_ENV=production
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
Configured for AI assistant interactions with Context7. The `.mcp.json` file contains server configuration for Claude Desktop integration:
- **Context7**: Documentation retrieval and library reference lookup

**Note**: Supabase MCP server is available but requires additional configuration in Claude Desktop with your project credentials.

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
- Car request notifications to admin
- Member car request notifications
- OpenLane submission confirmations
- Admin offer notifications to users
- Debug/testing endpoints available

### Document Processing
- **OCR Integration**: Uses Tesseract.js for client-side OCR and Azure Document Intelligence for server-side processing
- **File Storage**: AWS S3 integration for document storage
- **PDF Generation**: jsPDF for contract generation with digital signatures
- **Image Processing**: html2canvas for capturing digital signatures

### Next.js Configuration
- **Image Optimization**: Configured remote patterns for OpenLane, Copart, Unsplash, and Supabase storage
- **Security Headers**: Comprehensive security headers including HSTS, XSS protection, and CSP
- **Turbopack**: Used for faster development builds
- **App Router**: Utilizes Next.js 15 App Router architecture
- **API Timeouts**: OpenLane scraping endpoint configured with 30s timeout via vercel.json

## Current Development Rules

1. **Planning Phase**: First think through the problem, read the codebase for relevant files, and write a plan using TodoWrite tool
2. **Task Management**: The plan should have a list of todo items that you can check off as you complete them
3. **Approval Process**: Before you begin working, check in with me and I will verify the plan
4. **Execution**: Then, begin working on the todo items, marking them as complete as you go
5. **Communication**: Please every step of the way just give me a high level explanation of what changes you made
6. **Simplicity First**: Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity
7. **Documentation**: Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information

### Lint and Build Validation
ALWAYS run lint and build commands after significant changes:
- `npm run lint` - ESLint validation
- `npm run build` - Production build verification

### Security Review Process
After completing any work, check through all code to ensure:
- No sensitive information exposed in frontend
- No exploitable vulnerabilities
- Proper input validation and sanitization
- Correct RLS policy implementation

### Learning Review Process
When requested, explain functionality and code changes in detail, walking through what was changed and how it works, acting like a senior engineer teaching code.

## Important Context Notes

### Project Architecture Patterns
- **Component Organization**: Features are organized by domain (auth, admin, car-selection, dashboard, etc.)
- **Form Validation**: Consistent use of React Hook Form + Zod for all user inputs
- **State Management**: React Context for theme and language preferences, Supabase for data persistence
- **Error Handling**: Consistent error boundaries and toast notifications via react-hot-toast
- **Type Safety**: Full TypeScript coverage with generated database types from Supabase

### Development Dependencies
- **Playwright**: Available for E2E testing (not currently configured)
- **ESLint**: Next.js configuration with custom rules
- **Tailwind CSS v4**: Latest version with PostCSS integration
- **Upstash Redis**: Optional rate limiting (fallback to memory if not configured)
- **Cloudflare Turnstile**: Optional bot protection (skipped if not configured)