# Use the official Nginx image as the base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the web application files (HTML, CSS, JS) to the container's web root
COPY . .

# Expose port 80 to serve the application
EXPOSE 80

# The default Nginx command will serve the files