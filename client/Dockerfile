FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Install debugging tools
RUN apk add --no-cache gettext curl procps

# Copy built files and nginx config
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /

# Set environment variables
ENV PORT=8080
ENV HOST=0.0.0.0
ENV DEBUG=true

# Make entrypoint script executable
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Use entrypoint script for debugging
ENTRYPOINT ["/docker-entrypoint.sh"]
