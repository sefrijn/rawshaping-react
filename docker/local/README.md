# Local WordPress Development Environment

This directory contains the Docker Compose configuration for local WordPress development.

## Setup

1. Make sure Docker is installed and running on your machine
2. Ensure you have the `.env` file in this directory based on `.env.example`
3. From this directory, run:

```bash
docker compose up -d
```

## Services

- **raw-db**: MariaDB database server
- **raw-wordpress**: WordPress instance available at http://localhost:8008
- **raw-wp-cli**: WP-CLI container for WordPress management tasks

## Structure

The WordPress files are mapped from the `/apps/wordpress` directory:
- Themes are located at `/apps/wordpress/themes`
- Uploads are located at `/apps/wordpress/uploads` (not committed to git)

## Using WordPress Scripts

The WordPress sync scripts are located in `/apps/wordpress/scripts/` and can be run using pnpm from the WordPress directory:

```bash
cd ../apps/wordpress

# Start the Docker environment
pnpm docker:up

# Sync content from production
pnpm sync

# Sync just the uploads folder
pnpm uploads:sync

# Export the database from production
pnpm db:export

# Replace production URLs with local URLs
pnpm db:replace

# Import the database to local
pnpm db:import

# Stop the Docker environment
pnpm docker:down
```

## Stopping the Environment

To stop the environment, run:

```bash
docker compose down
```

To completely remove volumes (will delete database data):

```bash
docker compose down -v
``` 