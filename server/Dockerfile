FROM node:18-alpine
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite sqlite-dev

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild sqlite3
RUN npm install
RUN npm rebuild sqlite3

# Copy source code
COPY . .

# Create database directory
RUN mkdir -p database

# Build TypeScript
RUN npm run build

# Start the server
CMD ["node", "dist/index.js"] 