# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy your static assets from the public folder to the default Nginx serving directory
COPY ./public /usr/share/nginx/html

# Overwrite the default Nginx configuration file with your own configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the host, this is where Nginx is listening
EXPOSE 80

