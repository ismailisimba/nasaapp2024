FROM node:22-slim

# Set up working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .

# Grant permissions to the Hugging Face Spaces user (UID 1000)
RUN chmod -R 755 /app

# Hugging Face Spaces runs on port 7860
ENV PORT=7860
EXPOSE 7860

CMD [ "npm", "start" ]
