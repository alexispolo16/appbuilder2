#!/bin/sh
set -e

cd /app

# Validar que APP_KEY exista (env var — App Runner no monta .env)
if [ -z "${APP_KEY}" ]; then
    echo "FATAL: APP_KEY env var is not set. Cannot start." >&2
    exit 1
fi

# Limpiar cache residual del build antes de re-cachear
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

# Cache para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Correr migraciones pendientes (--isolated evita race conditions con múltiples réplicas)
php artisan migrate --force --no-interaction --isolated 2>/dev/null \
    || php artisan migrate --force --no-interaction

# Storage symlink (solo útil si FILESYSTEM_DISK=public, inofensivo si es s3)
php artisan storage:link 2>/dev/null || true

# Permisos
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

exec "$@"
