FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
