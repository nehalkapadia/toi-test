# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change working directory to the server folder
WORKDIR /usr/src/app

ARG NEXT_PORT=3002

ENV NEXT_PORT=$NEXT_PORT

# Expose the port the app runs on
EXPOSE $NEXT_PORT

# Change working directory to the server folder
WORKDIR /usr/src/app

# Build the nextjs production build && start the application
CMD ["sh", "-c", "npm run build && npm run start"]