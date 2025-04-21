#!/bin/bash

# Exit on error
set -e

# Determine docker-compose path and container prefix
if [ -f ../../docker/local/docker-compose.yaml ]; then
    DOCKER_COMPOSE_DIR="../../docker/local"
    CONTAINER_PREFIX="raw-"
else
    DOCKER_COMPOSE_DIR="."
    CONTAINER_PREFIX=""
fi

echo "🔄 Starting sync process..."

echo "📤 Syncing uploads..."
bash ./scripts/sync_uploads.sh

echo "💾 Syncing database..."
bash ./scripts/sync_database.sh

echo "🔄 Replacing database..."
bash ./scripts/replace_database.sh

echo "📥 Importing database..."
bash ./scripts/import_database.sh

echo "🔄 Updating WordPress database..."
docker compose -f $DOCKER_COMPOSE_DIR/docker-compose.yaml start ${CONTAINER_PREFIX}wp-cli

echo "✅ Sync process completed!" 