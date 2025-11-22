tunnel: 4f5e6560-6987-42a3-9360-305457c21f71
credentials-file: /etc/cloudflared/4f5e6560-6987-42a3-9360-305457c21f71.json

ingress:
  - hostname: app.dietiestates.trycloudflare.com
    service: http://nginx:80

  - hostname: api.dietiestates.trycloudflare.com
    service: http://backend:8080

  - hostname: minio.dietiestates.trycloudflare.com
    service: http://minio:9000

  - service: http_status:404