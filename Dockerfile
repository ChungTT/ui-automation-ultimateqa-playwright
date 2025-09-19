# Use the official Playwright base image (includes Node.js, browsers, and drivers)
FROM mcr.microsoft.com/playwright:v1.47.2-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy package definition files first to leverage Docker build cache
COPY package*.json ./

# Install dependencies (prefer clean install, fallback to install if lockfile is missing)
RUN npm ci || npm install

# Copy the rest of the application source code
COPY . .

# Install Playwright browsers and required system dependencies
RUN npx playwright install --with-deps

# Default command: run tests
CMD ["npm", "test"]
