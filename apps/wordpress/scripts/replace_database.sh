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

# Get the most recent backup file
LATEST_BACKUP=$(ls -t db_data/${LIVE_DB_NAME}_*.sql | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "Error: No backup files found in db_data directory"
    exit 1
fi

OUTPUT_FILE="db_data/${LOCAL_DB_NAME}.sql"
TEMP_SQL="db_data/temp.sql"

# Perform the string replacement
echo "Replacing '$LIVE_URL' with '$LOCAL_WORDPRESS_URL' in the SQL file..."
if sed -i '' "s|$LIVE_URL|$LOCAL_WORDPRESS_URL|g" "$LATEST_BACKUP"; then
    echo "Replacement completed successfully."
else
    echo "Error: Failed to replace strings in the SQL file."
    exit 1
fi

# Move the modified file to the output location
if mv "$LATEST_BACKUP" "$OUTPUT_FILE"; then
    echo "Modified backup saved as $OUTPUT_FILE"
else
    echo "Error: Failed to move the modified file."
    exit 1
fi

echo "Done!" 