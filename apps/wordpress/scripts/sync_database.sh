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

# Backup directory and filename
BACKUP_DIR="./db_data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${LIVE_DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Perform the backup
echo "Starting database backup..."
mysqldump --host="$LIVE_DB_HOST" \
          --user="$LIVE_DB_USER" \
          --password="$LIVE_DB_PASS" \
          --ssl=0 \
          --single-transaction \
          --quick \
          --lock-tables=false \
          "$LIVE_DB_NAME" > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully!"
    echo "Backup saved to: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi 