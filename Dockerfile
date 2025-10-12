# Build stage (with devDependencies for testing)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .

# Test stage
FROM builder AS test
CMD ["npm", "run", "test"]

# Production stage (without devDependencies)
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]

