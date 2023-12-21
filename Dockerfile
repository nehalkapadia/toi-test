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
WORKDIR /usr/src/app/server

# Run sequelize migrations
RUN npx sequelize db:migrate

# Run sequelize migrations
RUN npx sequelize db:seed:all

# Expose the port the app runs on
EXPOSE 3009

# Change working directory to the server folder
WORKDIR /usr/src/app

# Start the application
CMD ["npm", "run", "dev"]