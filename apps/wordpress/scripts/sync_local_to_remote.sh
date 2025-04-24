#!/bin/bash

# Exit on error
set -e

# Function to read environment variables safely
read_env_file() {
    local env_file="$1"
    echo "Loading environment variables from $env_file..."
    
    while IFS= read -r line; do
        # Skip comments and empty lines
        [[ $line =~ ^[[:space:]]*# ]] && continue
        [[ -z $line ]] && continue
        
        # Extract key=value, handling quotes
        if [[ $line =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*) ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            
            # Remove surrounding quotes if present
            value="${value#\"}"
            value="${value%\"}"
            value="${value#\'}"
            value="${value%\'}"
            
            # Export the variable
            export "$key=$value"
        fi
    done < "$env_file"
}

# Find and load the .env file
if [ -f .env ]; then
    read_env_file ".env"
elif [ -f ../../docker/local/.env ]; then
    read_env_file "../../docker/local/.env"
else
    echo "Error: .env file not found in current directory or in docker/local!"
    exit 1
fi

# Check for required variables
if [ -z "$LOCAL_DB_USER" ] || [ -z "$LOCAL_DB_PASSWORD" ] || [ -z "$LOCAL_DB_NAME" ] || 
   [ -z "$LOCAL_WORDPRESS_URL" ] || [ -z "$NEW_LIVE_URL" ] ||
   [ -z "$NEW_LIVE_DB_HOST" ] || [ -z "$NEW_LIVE_DB_USER" ] || 
   [ -z "$NEW_LIVE_DB_PASS" ] || [ -z "$NEW_LIVE_DB_NAME" ]; then
    echo "Error: Required database variables not found in .env file!"
    exit 1
fi

# Parse remote host and port
DB_HOST=$(echo "${NEW_LIVE_DB_HOST%%:*}" | tr -d '"')
DB_PORT=$(echo "${NEW_LIVE_DB_HOST#*:}" | tr -d '"')
[ "$DB_HOST" = "$DB_PORT" ] && DB_PORT=3306  # Default port if no colon in host

# Clean up other variables
DB_USER=$(echo "$NEW_LIVE_DB_USER" | tr -d '"')
DB_NAME=$(echo "$NEW_LIVE_DB_NAME" | tr -d '"')
DB_PASS="$NEW_LIVE_DB_PASS"

# Setup paths and filenames
BACKUP_DIR="./db_data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOCAL_BACKUP_FILE="$BACKUP_DIR/local_${LOCAL_DB_NAME}_${TIMESTAMP}.sql"
MODIFIED_BACKUP_FILE="$BACKUP_DIR/remote_${LOCAL_DB_NAME}_${TIMESTAMP}.sql"
mkdir -p "$BACKUP_DIR"

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

# Get the actual container name
DB_CONTAINER=$(docker compose -f $DOCKER_COMPOSE_DIR/docker-compose.yaml ps -q ${CONTAINER_PREFIX}db)

# Identify database dump command
echo "Checking available database dump commands..."
if docker exec $DB_CONTAINER which mariadb-dump > /dev/null 2>&1; then
    DUMP_CMD="mariadb-dump"
elif docker exec $DB_CONTAINER which mysqldump > /dev/null 2>&1; then
    DUMP_CMD="mysqldump"
elif docker exec $DB_CONTAINER which mariadb > /dev/null 2>&1; then
    DUMP_CMD="mariadb --dump"
else
    echo "Error: Could not find database dump command in container"
    exit 1
fi
echo "Using $DUMP_CMD command"

# Export the local database
echo "Exporting local database to $LOCAL_BACKUP_FILE..."
if ! docker exec $DB_CONTAINER sh -c "$DUMP_CMD -u'$LOCAL_DB_USER' -p'$LOCAL_DB_PASSWORD' '$LOCAL_DB_NAME'" > "$LOCAL_BACKUP_FILE"; then
    echo "Error: Local database export failed!"
    exit 1
fi
echo "Local database export completed successfully!"

# Perform the string replacement
echo "Replacing '$LOCAL_WORDPRESS_URL' with '$NEW_LIVE_URL' in the SQL file..."
if ! sed -i '' "s|$LOCAL_WORDPRESS_URL|$NEW_LIVE_URL|g" "$LOCAL_BACKUP_FILE"; then
    echo "Error: Failed to replace strings in the SQL file."
    exit 1
fi
echo "Replacement completed successfully."

# Create a copy of the modified file
cp "$LOCAL_BACKUP_FILE" "$MODIFIED_BACKUP_FILE"
echo "Modified backup saved as $MODIFIED_BACKUP_FILE"

# Create a temporary my.cnf file to securely pass credentials
MYSQL_CONF=$(mktemp)
cat > "$MYSQL_CONF" << EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USER
password=$DB_PASS
EOF

# Import to remote database
echo "Importing database to remote server at $DB_HOST:$DB_PORT..."
if mysql --defaults-file="$MYSQL_CONF" --ssl=0 "$DB_NAME" < "$MODIFIED_BACKUP_FILE"; then
    echo "Remote database import completed successfully!"
else
    echo "Error: Remote database import failed!"
    rm -f "$MYSQL_CONF"
    exit 1
fi

# Clean up
rm -f "$MYSQL_CONF"
echo "✅ Local to remote database sync completed!" 