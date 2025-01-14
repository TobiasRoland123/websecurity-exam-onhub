# Start with a minimal Node.js Alpine image
FROM node:18-alpine

# Install curl and bash (for debugging as well)
RUN apk --no-cache add curl bash

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
ARG RTE
RUN if [ "$RTE" = "prod" ]; then npm install --only=production; else npm install; fi

# Copy the rest of the app
COPY . .

# Set the server port
ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

# Start the application
ENTRYPOINT ["sh", "entrypoint.sh"]