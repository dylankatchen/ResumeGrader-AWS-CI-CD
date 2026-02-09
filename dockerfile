# Build Stage
FROM node:20 as build
WORKDIR /app

# Copy frontend source and install dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./
RUN npm run build

# Production Stage
FROM node:20
WORKDIR /app

# Copy backend dependencies and install
COPY package*.json ./
RUN npm install

# Copy backend source
COPY src/ ./src

# Copy built frontend assets to 'public' directory
COPY --from=build /app/frontend/dist ./public

# Expose port (matches ECS container port)
EXPOSE 3000

# Start app
CMD ["node", "src/server.js"]
