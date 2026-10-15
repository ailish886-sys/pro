# Production-ready lightweight web server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration directly to default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy project files to Nginx html directory
COPY index.html style.css script.js /usr/share/nginx/html/

# Expose ports 8080 and 80
EXPOSE 8080
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
