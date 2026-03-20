## ---- Stage 1: Build frontend assets ----
FROM node:20-alpine AS frontend

WORKDIR /build

# Copy only package files first (cache npm install)
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Now copy source and build
COPY backend/vite.config.js ./
COPY backend/resources ./resources
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build


## ---- Stage 2: PHP application ----
FROM dunglas/frankenphp:latest-php8.3

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first (cache composer install)
COPY backend/composer.json backend/composer.lock /app/
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev --no-scripts

# Copy full application
COPY backend/ /app/

# Regenerate autoload with full codebase
RUN composer dump-autoload --optimize --no-dev

# Copy built frontend assets from Stage 1
COPY --from=frontend /build/public/build /app/public/build

# PHP OPcache configuration for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/opcache.ini

# Set permissions for storage and cache
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Make FrankenPHP binary available for Octane
RUN cp /usr/local/bin/frankenphp /app/frankenphp && chmod +x /app/frankenphp

# Supervisor config for Octane + Queue Worker + Reverb
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Entrypoint script for runtime initialization
COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
