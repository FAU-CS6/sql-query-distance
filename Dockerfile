FROM node:20

# Create the main working directory
WORKDIR /app

# Copy the npm package files and install the dependencies 
# (separate step to cache the dependencies)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set the command to start the webserver
CMD ["npm", "test"]
