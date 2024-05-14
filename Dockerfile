# Use Node.js as base image
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app source code to container
COPY . .

# Expose port (if needed)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
