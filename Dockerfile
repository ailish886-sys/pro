# Production-ready lightweight web server
FROM nginx:alpine

# Railway routes public traffic to Port 8080
ENV PORT=8080

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy template configuration (Nginx automatically substitutes ${PORT} into /etc/nginx/conf.d/default.conf)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy project files to Nginx html directory
COPY index.html style.css script.js /usr/share/nginx/html/

# Expose port 8080
EXPOSE 8080

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
