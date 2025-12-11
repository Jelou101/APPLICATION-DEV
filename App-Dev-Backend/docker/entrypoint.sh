#!/bin/bash
set -e

echo "🚀 Starting Laravel application setup..."

# Wait for database to be ready (retry logic)
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
  if php artisan tinker --execute="DB::connection()->getPdo()" 2>/dev/null; then
    echo "✅ Database is ready!"
    break
  fi
  echo "Attempt $i/30 - Database not ready yet, retrying in 2 seconds..."
  sleep 2
done

# Run migrations
echo "🔄 Running database migrations..."
php artisan migrate --force || echo "⚠️ Migrations may have already run or encountered an error"

# Cache configuration for production
echo "⚡ Caching Laravel configuration..."
php artisan config:cache

# Cache routes for performance
echo "🛣️ Caching Laravel routes..."
php artisan route:cache

# Cache views for performance
echo "🎨 Caching Laravel views..."
php artisan view:cache

echo "✅ Laravel setup complete!"
echo "🌐 Starting supervisor (Nginx + PHP-FPM)..."

# Execute the CMD (supervisor)
exec "$@"
