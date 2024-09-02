# Use an official Nginx runtime as a parent image
FROM nginx:stable-alpine3.20

# Install openssl package to generate self-signed certificate
RUN apk add --no-cache openssl

# Create directory for SSL certs
RUN mkdir -p /etc/nginx/certs

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/self.key \
    -out /etc/nginx/certs/self.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Remove default configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file
COPY conf/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 443

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
