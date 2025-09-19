# Playwright base image: comes with Node.js + browsers + system dependencies
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

# Application working directory
WORKDIR /app

# Prevent npm postinstall from downloading browsers again
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Leverage Docker cache: copy package files first
COPY package*.json ./

# Install dependencies (use ci if lockfile exists, fallback to install)
RUN npm ci || npm install

# Copy the rest of the source code
COPY . .

# Do NOT run: npx playwright install --with-deps
# (the base image already includes all required browsers + deps)

# Default command: run tests
CMD ["npm", "test"]
