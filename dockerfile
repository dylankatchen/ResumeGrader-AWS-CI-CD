# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src

# Expose port (matches ECS container port)
EXPOSE 3000

# Start app
CMD ["node", "src/server.js"]
