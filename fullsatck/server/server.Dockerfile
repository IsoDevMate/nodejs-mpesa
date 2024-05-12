FROM node:20

# Create an application directory
RUN mkdir -p app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json .

# Install production dependencies
RUN npm install --production --silent && mv node_modules ../

# Install node packages
RUN npm install -g nodemon 

# Copy our project directory (locally) in the current directory of our docker image (/app)
COPY . .

# Environment variables
#ENV MPESA_PORT $MPESA_PORT
#ENV MPESA_PAYBILL $MPESA_PAYBILL
#ENV MPESA_CONSUMER_KEY $MPESA_CONSUMER_KEY
#ENV MPESA_PASSKEY $MPESA_PASSKEY
#ENV MPESA_CONSUMER_SECRET $MPESA_CONSUMER_SECRET
#ENV DATABASE_URI $DATABASE_URI
#ENV CALLBACK_URL $CALLBACK_URL

# Expose $PORT on container.
EXPOSE 5050

# Start the app
CMD ["npm","start"]
