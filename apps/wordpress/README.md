# Rawshaping WordPress (Headless CMS)

This WordPress installation serves as a headless CMS using the WordPress REST API to provide content for the Next.js frontend.

## Folder Structure

- `themes/raw13/` - Custom WordPress theme
- `uploads/` - Media uploads directory synced from production
- `db_data/` - Database exports and imports
- `scripts/` - Utility scripts for syncing and management

## Available Commands

Run these commands from this directory using pnpm:

```bash
# Docker management
pnpm docker:up        # Start the Docker environment
pnpm docker:down      # Stop the Docker environment

# Content sync
pnpm sync             # Sync everything from production (DB + uploads)
pnpm uploads:sync     # Sync only the uploads folder
pnpm db:export        # Export the database from production
pnpm db:replace       # Process the DB export (replace URLs)
pnpm db:import        # Import the processed DB to local
pnpm db:update        # Run WP-CLI updates
```

## Development

- WordPress admin: http://localhost:8008/wp-admin
- REST API base: http://localhost:8008/wp-json/wp/v2
- Custom endpoints: http://localhost:8008/wp-json/raw/v1

## Docker Configuration

The Docker configuration has been moved to `/docker/local/`. The container names are prefixed with "raw-" and the project name is set to "rawshaping".

For more detailed Docker information, see the README in the `/docker/local/` directory.
