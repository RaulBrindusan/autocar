# Supabase MCP Server Setup

## Environment Variable Setup

To securely use the Supabase MCP server, you need to set your Supabase access token as an environment variable.

### 1. Get Your Supabase Access Token

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Account Settings > Access Tokens
3. Create a new personal access token if you don't have one

### 2. Set the Environment Variable

#### On Linux/WSL/macOS:
```bash
export SUPABASE_ACCESS_TOKEN="your_actual_token_here"
```

#### On Windows (PowerShell):
```powershell
$env:SUPABASE_ACCESS_TOKEN="your_actual_token_here"
```

#### On Windows (Command Prompt):
```cmd
set SUPABASE_ACCESS_TOKEN=your_actual_token_here
```

### 3. Make it Permanent (Optional)

#### Linux/WSL/macOS - Add to your shell profile:
```bash
echo 'export SUPABASE_ACCESS_TOKEN="your_actual_token_here"' >> ~/.bashrc
source ~/.bashrc
```

#### Windows - Set system environment variable:
```cmd
setx SUPABASE_ACCESS_TOKEN "your_actual_token_here"
```

## MCP Server Features

The Supabase MCP server provides these tools for LLMs:

### Project Management
- `list_projects`: Lists all your Supabase projects
- `get_project`: Gets details for a project
- `create_project`: Creates a new project
- `pause_project`/`restore_project`: Project lifecycle management

### Database Operations
- `list_tables`: Lists all tables in specified schemas
- `execute_sql`: Executes raw SQL queries (read-only mode enabled)
- `apply_migration`: Applies SQL migrations (disabled in read-only mode)
- `get_logs`: Gets service logs for debugging
- `get_advisors`: Gets security and performance advisories

### Development Tools
- `search_docs`: Searches Supabase documentation
- `generate_typescript_types`: Generates TypeScript types from database schema

### Project Configuration
- `get_project_url`: Gets the API URL for your project
- `get_anon_key`: Gets the anonymous API key

## Security Notes

- The configuration uses `--read-only` flag for safety
- Access token is loaded from environment variable (not hardcoded)
- Project ref is scoped to your specific project: `dbwpukfrcttfcyocijvd`

## Testing the Setup

After setting the environment variable, restart your Claude Code session to test the Supabase MCP integration.