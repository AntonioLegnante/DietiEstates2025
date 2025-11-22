FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for certificates (Let’s Encrypt)
RUN mkdir -p /etc/letsencrypt/live \
    && mkdir -p /etc/letsencrypt/archive \
    && mkdir -p /var/www/certbot

EXPOSE 80
EXPOSE 443
