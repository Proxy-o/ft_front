# Use the official Node.js image.
FROM node:18-alpine3.20

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY ./frontend/package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY ./frontend .

# Copy environment variables
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "run", "dev"]
