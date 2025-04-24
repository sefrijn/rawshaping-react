#!/bin/bash

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
if [ -z "$NEW_LIVE_DB_HOST" ] || [ -z "$NEW_LIVE_DB_USER" ] || [ -z "$NEW_LIVE_DB_PASS" ] || [ -z "$NEW_LIVE_DB_NAME" ]; then
    echo "Error: Required remote database variables not found in .env file!"
    exit 1
fi

# Parse host and port
DB_HOST=$(echo "${NEW_LIVE_DB_HOST%%:*}" | tr -d '"')
DB_PORT=$(echo "${NEW_LIVE_DB_HOST#*:}" | tr -d '"')
[ "$DB_HOST" = "$DB_PORT" ] && DB_PORT=3306  # Default port if no colon in host

# Clean up other variables
DB_USER=$(echo "$NEW_LIVE_DB_USER" | tr -d '"')
DB_NAME=$(echo "$NEW_LIVE_DB_NAME" | tr -d '"')
DB_PASS="$NEW_LIVE_DB_PASS"

echo "Testing connection to database server at $DB_HOST:$DB_PORT..."
echo "Username: $DB_USER"
echo "Database: $DB_NAME"

# Create a temporary my.cnf file to securely pass credentials
MYSQL_CONF=$(mktemp)
cat > "$MYSQL_CONF" << EOF
[client]
host=$DB_HOST
port=$DB_PORT
user=$DB_USER
password=$DB_PASS
EOF

echo "Using temporary configuration file for authentication"

# Test the connection
if mysql --defaults-file="$MYSQL_CONF" --ssl=0 --connect-timeout=10 -e "SELECT 'Connection successful!'" > /dev/null 2>&1; then
    echo "✅ Connection to database server successful!"
    
    # List tables to verify database access
    echo "Attempting to list tables in database $DB_NAME..."
    if mysql --defaults-file="$MYSQL_CONF" --ssl=0 "$DB_NAME" -e "SHOW TABLES;"; then
        echo "✅ Database access verified successfully!"
    else
        echo "❌ Could connect to server, but couldn't access database: $DB_NAME"
        echo "Please check database name and user permissions."
    fi
else
    echo "❌ Connection to database server failed!"
    echo "=== Diagnostics ==="
    
    # Check connectivity
    if ping -c 1 "$DB_HOST" > /dev/null 2>&1; then
        echo "✅ Host is reachable via ping"
    else
        echo "❌ Host is not responding to ping"
    fi
    
    if nc -z -w 3 "$DB_HOST" "$DB_PORT" > /dev/null 2>&1; then
        echo "✅ Port $DB_PORT is open on $DB_HOST"
    else
        echo "❌ Port $DB_PORT is closed or blocked on $DB_HOST"
    fi
    
    echo "Please check your connection details and network access"
fi

# Clean up
rm -f "$MYSQL_CONF" 