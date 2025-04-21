#!/bin/bash

# Load the .env file
if [ -f .env ]; then
    source .env
else
    # Try to load from docker/local/.env if local .env is not found
    if [ -f ../../docker/local/.env ]; then
        source ../../docker/local/.env
    else
        echo "Error: .env file not found in current directory or in docker/local!"
        exit 1
    fi
fi

IMPORT_FILE="./db_data/$LOCAL_DB_NAME.sql"

# Check if import file exists
if [ ! -f "$IMPORT_FILE" ]; then
    echo "Error: Import file $IMPORT_FILE not found!"
    echo "Please run replace_database.sh first to create the import file."
    exit 1
fi

# Determine docker-compose path and container prefix
if [ -f ../../docker/local/docker-compose.yaml ]; then
    DOCKER_COMPOSE_DIR="../../docker/local"
    CONTAINER_PREFIX="raw-"
else
    DOCKER_COMPOSE_DIR="."
    CONTAINER_PREFIX=""
fi

# Check if containers are running
if ! docker compose -f $DOCKER_COMPOSE_DIR/docker-compose.yaml ps | grep -q "${CONTAINER_PREFIX}db.*Up"; then
    echo "Error: Database container is not running!"
    echo "Please start the containers first with: docker compose -f $DOCKER_COMPOSE_DIR/docker-compose.yaml up -d"
    exit 1
fi
echo "Database container is running. Continuing..."

# Get the actual container name from docker-compose
DB_CONTAINER=$(docker compose -f $DOCKER_COMPOSE_DIR/docker-compose.yaml ps -q ${CONTAINER_PREFIX}db)

# Import the database
echo "Importing database from $IMPORT_FILE..."
if docker exec -i $DB_CONTAINER mariadb -u$LOCAL_DB_USER -p$LOCAL_DB_PASSWORD $LOCAL_DB_NAME < "$IMPORT_FILE"; then
    echo "Database import completed successfully!"
else
    echo "Error: Database import failed!"
    exit 1
fi