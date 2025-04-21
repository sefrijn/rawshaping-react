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

LOCAL_DIR="./uploads"

# Create local directory if it doesn't exist
mkdir -p "$LOCAL_DIR"

# Use lftp to sync the remote folder to local
lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" << EOF
set ftp:ssl-allow no  # Adjust if your server requires SSL
mirror --verbose \
       --delete \
       --only-newer \
       --exclude .htaccess \
       "$FTP_UPLOADS_REMOTE_DIR" "$LOCAL_DIR"
quit
EOF

echo "Sync completed!"