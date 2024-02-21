FROM ghcr.io/puppeteer/puppeteer:16.1.0

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci 

RUN npx prisma generate

# Copy application code
COPY . .

# Set entry point
ENTRYPOINT ["node", "index.js"]
