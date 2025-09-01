# Static site served by nginx
FROM nginx:1.27-alpine

# Add metadata labels
LABEL maintainer="${MAINTAINER_EMAIL:-your-email@example.com}"
LABEL project="${APP_NAME:-myproject}"
LABEL version="${VERSION:-1.0.0}"
LABEL description="JavaZone schedule static site"

# Install curl for health checks (alpine variant)
RUN apk add --no-cache curl

# Copy static site to nginx html directory
COPY site /usr/share/nginx/html

# Route nginx logs to container stdout/stderr for `docker logs`
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

# Expose standard HTTP port inside container
EXPOSE 80

# Container-level health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -fsS http://localhost/health || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
