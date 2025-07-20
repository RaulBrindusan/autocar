# AutoCar - European Car Import Platform

A Next.js application for importing premium European cars to Romania, built with Supabase authentication and database integration, plus MCP (Model Context Protocol) server support.

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Car Request System**: Users can request specific cars with detailed requirements
- **Cost Calculator**: Real-time cost estimation for car imports
- **OpenLane Integration**: Submit and manage OpenLane auction links
- **MCP Support**: Integrated Supabase MCP server for AI assistant interactions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety with database schema types

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **MCP**: Supabase MCP Server integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autocar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_ACCESS_TOKEN=your_personal_access_token
   SUPABASE_PROJECT_REF=your_project_reference
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL in `database/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables, RLS policies, and triggers

5. **Configure MCP (Optional)**
   - Update `.mcp.json` with your actual Supabase project details
   - Replace placeholders with real values:
     ```json
     {
       "mcpServers": {
         "supabase": {
           "args": [
             "--project-ref=your-actual-project-ref"
           ],
           "env": {
             "SUPABASE_ACCESS_TOKEN": "your-actual-access-token"
           }
         }
       }
     }
     ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main tables:

- **users**: Extended user profiles (linked to Supabase auth)
- **car_requests**: Car import requests with specifications
- **cost_estimates**: Saved cost calculations
- **openlane_submissions**: OpenLane auction submissions

All tables include Row Level Security (RLS) policies for data protection.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── home/              # Home page components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client configurations
│   ├── database.types.ts  # TypeScript database types
│   └── utils.ts           # Utility functions
└── middleware.ts          # Next.js middleware for auth
```

## MCP Integration

This project includes Supabase MCP server integration for AI assistants:

### Available Tools
- **Database Operations**: Execute SQL, apply migrations
- **Project Management**: List projects, get project details
- **Edge Functions**: Deploy and manage functions
- **Development Tools**: Generate TypeScript types, search docs

### Usage with Claude Desktop
Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=your-project-ref"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-personal-access-token"
      }
    }
  }
}
```

## Authentication Flow

1. **Signup**: Users create account with email verification
2. **Login**: Email/password authentication
3. **Protected Routes**: Middleware handles authentication state
4. **User Profile**: Automatic profile creation on signup

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Authentication Middleware**: Route protection
- **CSRF Protection**: Built-in Next.js protections
- **Environment Variables**: Secure credential storage

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

Ensure you set all required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email contact@autocar.ro or create an issue in the repository.
