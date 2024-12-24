#!/bin/sh
set -e

# Debug information
echo "Starting container with:"
echo "PORT=$PORT"
echo "HOST=$HOST"

# Check if nginx config template exists
if [ ! -f /etc/nginx/templates/default.conf.template ]; then
    echo "Error: Nginx config template not found"
    exit 1
fi

# Process the template
echo "Processing nginx configuration..."
envsubst '${PORT} ${HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify nginx configuration
echo "Verifying nginx configuration..."
nginx -t

# Start nginx with debug mode if DEBUG is set
if [ "$DEBUG" = "true" ]; then
    echo "Starting nginx in debug mode..."
    nginx-debug -g 'daemon off;'
else
    echo "Starting nginx..."
    nginx -g 'daemon off;'
fi 