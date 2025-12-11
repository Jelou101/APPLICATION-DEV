# Environment Variables Audit

**Date:** December 11, 2025  
**Purpose:** Complete inventory of all `env()` calls in the codebase to ensure no missing or unused variables.

---

## 1. CUSTOM / AI-SPECIFIC VARIABLES (Active in your code)

### Gemini API Keys (Multiple)
These are currently used by different controllers:

| Variable | Used In | Purpose | Current Status |
|----------|---------|---------|-----------------|
| `GEMINI_API_KEY` | RiddleController, TestController, routes/api.php | Primary Gemini API key | ✅ Defined |
| `GEMINI_API_KEY_3` | routes/api.php (test-gemini-logic) | Alternative Gemini key for Logic tests | ✅ Defined |
| `GEMINI_API_KEY_5` | LogicController | Gemini key for Logic questions | ✅ Defined |
| `GEMINI_API_KEY_1` | (Currently unused) | Backup key | ⚠️ Defined but unused |
| `GEMINI_API_KEY_2` | (Currently unused) | Backup key | ⚠️ Defined but unused |
| `GEMINI_API_KEY_4` | (Currently unused) | Backup key | ⚠️ Defined but unused |

### Gemini Model Configuration
| Variable | Used In | Purpose | Current Status |
|----------|---------|---------|-----------------|
| `GEMINI_MODEL` | RiddleController | Override model (defaults to `gemini-2.0-flash-lite`) | ⚠️ Not defined in `.env` |

### OpenRouter API (Alternative Provider)
| Variable | Used In | Purpose | Current Status |
|----------|---------|---------|-----------------|
| `OPENROUTER_API_KEY` | OpenRouterService | OpenRouter AI API key | ❌ Not defined |
| `OPENROUTER_BASE_URL` | OpenRouterService | OpenRouter API base URL | ⚠️ Default: `https://openrouter.ai/api/v1` |
| `OPENROUTER_MODEL` | OpenRouterService | Model to use | ⚠️ Default: `openai/gpt-oss-20b:free` |

---

## 2. DATABASE VARIABLES (Required for Railway)

| Variable | Used In | Purpose | Current Status | Current Value |
|----------|---------|---------|-----------------|----------------|
| `DB_CONNECTION` | config/database.php | Database type | ✅ Defined | `mysql` |
| `DB_HOST` | config/database.php | Database host | ✅ Defined | `ballast.proxy.rlwy.net` |
| `DB_PORT` | config/database.php | Database port | ✅ Defined | `33235` |
| `DB_DATABASE` | config/database.php | Database name | ✅ Defined | `railway` |
| `DB_USERNAME` | config/database.php | Database user | ✅ Defined | `root` |
| `DB_PASSWORD` | config/database.php | Database password | ✅ Defined | (present) |
| `DB_CHARSET` | config/database.php | Character set | ⚠️ Default: `utf8mb4` |
| `DB_COLLATION` | config/database.php | Collation | ⚠️ Default: `utf8mb4_unicode_ci` |
| `DB_SOCKET` | config/database.php | Unix socket path | ⚠️ Optional, defaults to empty |
| `DB_URL` | config/database.php | Full database URL | ⚠️ Not defined (alternative to individual vars) |
| `MYSQL_ATTR_SSL_CA` | config/database.php | SSL CA cert path | ⚠️ Optional for SSL |

---

## 3. LARAVEL CORE VARIABLES (Standard Config)

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `APP_NAME` | config/app.php, logging.php | Application name | ✅ Defined | `Laravel` |
| `APP_ENV` | config/app.php | Environment mode | ✅ Defined | `local` |
| `APP_KEY` | config/app.php | Encryption key | ✅ Defined | (present) |
| `APP_DEBUG` | config/app.php | Debug mode | ✅ Defined | `true` |
| `APP_URL` | config/app.php, mail.php | Application URL | ✅ Defined | `http://localhost` |
| `APP_LOCALE` | config/app.php | Locale | ✅ Defined | `en` |
| `APP_FALLBACK_LOCALE` | config/app.php | Fallback locale | ✅ Defined | `en` |
| `APP_FAKER_LOCALE` | config/app.php | Faker locale for seeding | ✅ Defined | `en_US` |
| `APP_MAINTENANCE_DRIVER` | config/app.php | Maintenance mode driver | ✅ Defined | `file` |
| `APP_MAINTENANCE_STORE` | config/app.php | Maintenance mode store | ⚠️ Default: `database` |
| `APP_PREVIOUS_KEYS` | config/app.php | Previous encryption keys | ⚠️ Optional (empty array) |

---

## 4. LOGGING VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `LOG_CHANNEL` | config/logging.php | Default log channel | ✅ Defined | `stack` |
| `LOG_STACK` | config/logging.php | Stack channels | ✅ Defined | `single` |
| `LOG_DEPRECATIONS_CHANNEL` | config/logging.php | Deprecation log channel | ✅ Defined | `null` |
| `LOG_LEVEL` | config/logging.php | Log level | ✅ Defined | `debug` |
| `LOG_DEPRECATIONS_TRACE` | config/logging.php | Trace deprecations | ⚠️ Default: `false` |
| `LOG_DAILY_DAYS` | config/logging.php | Days to keep daily logs | ⚠️ Default: `14` |
| `LOG_SLACK_WEBHOOK_URL` | config/logging.php | Slack webhook URL | ❌ Not defined (optional) |
| `LOG_SLACK_USERNAME` | config/logging.php | Slack bot username | ⚠️ Default: `Laravel Log` |
| `LOG_SLACK_EMOJI` | config/logging.php | Slack emoji | ⚠️ Default: `:boom:` |
| `PAPERTRAIL_URL` | config/logging.php | Papertrail syslog host | ❌ Not defined (optional) |
| `PAPERTRAIL_PORT` | config/logging.php | Papertrail syslog port | ❌ Not defined (optional) |
| `LOG_STDERR_FORMATTER` | config/logging.php | Stderr log formatter | ❌ Not defined (optional) |
| `LOG_SYSLOG_FACILITY` | config/logging.php | Syslog facility | ⚠️ Default: `LOG_USER` |

---

## 5. SESSION VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `SESSION_DRIVER` | config/session.php | Session driver | ⚠️ Default: `database` |
| `SESSION_LIFETIME` | config/session.php | Session lifetime (minutes) | ⚠️ Default: `120` |
| `SESSION_EXPIRE_ON_CLOSE` | config/session.php | Expire on browser close | ⚠️ Default: `false` |
| `SESSION_ENCRYPT` | config/session.php | Encrypt session data | ⚠️ Default: `false` |
| `SESSION_CONNECTION` | config/session.php | Database connection | ❌ Not defined (optional) |
| `SESSION_TABLE` | config/session.php | Sessions table name | ⚠️ Default: `sessions` |
| `SESSION_STORE` | config/session.php | Session store | ❌ Not defined (optional) |
| `SESSION_PATH` | config/session.php | Cookie path | ⚠️ Default: `/` |
| `SESSION_DOMAIN` | config/session.php | Cookie domain | ❌ Not defined (optional) |
| `SESSION_SECURE_COOKIE` | config/session.php | HTTPS only | ❌ Not defined (optional, bool) |
| `SESSION_HTTP_ONLY` | config/session.php | HTTP only cookie | ⚠️ Default: `true` |
| `SESSION_SAME_SITE` | config/session.php | SameSite attribute | ⚠️ Default: `lax` |
| `SESSION_PARTITIONED_COOKIE` | config/session.php | Partitioned cookie | ⚠️ Default: `false` |

---

## 6. CACHE VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `CACHE_STORE` | config/cache.php | Default cache store | ✅ Defined | `file` |
| `CACHE_PREFIX` | config/cache.php | Cache key prefix | ⚠️ Default: `{APP_NAME}-cache-` |
| `DB_CACHE_CONNECTION` | config/cache.php | Cache database connection | ❌ Not defined (optional) |
| `DB_CACHE_TABLE` | config/cache.php | Cache table name | ⚠️ Default: `cache` |
| `DB_CACHE_LOCK_CONNECTION` | config/cache.php | Cache lock connection | ❌ Not defined (optional) |
| `DB_CACHE_LOCK_TABLE` | config/cache.php | Cache lock table | ❌ Not defined (optional) |
| `MEMCACHED_PERSISTENT_ID` | config/cache.php | Memcached persistent ID | ❌ Not defined (optional) |
| `MEMCACHED_USERNAME` | config/cache.php | Memcached username | ❌ Not defined (optional) |
| `MEMCACHED_PASSWORD` | config/cache.php | Memcached password | ❌ Not defined (optional) |
| `MEMCACHED_HOST` | config/cache.php | Memcached host | ⚠️ Default: `127.0.0.1` |
| `MEMCACHED_PORT` | config/cache.php | Memcached port | ⚠️ Default: `11211` |
| `REDIS_CACHE_CONNECTION` | config/cache.php | Redis cache connection | ⚠️ Default: `cache` |
| `REDIS_CACHE_LOCK_CONNECTION` | config/cache.php | Redis cache lock connection | ⚠️ Default: `default` |

---

## 7. REDIS VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `REDIS_CLIENT` | config/database.php | Redis client type | ⚠️ Default: `phpredis` |
| `REDIS_URL` | config/database.php | Redis connection URL | ❌ Not defined |
| `REDIS_HOST` | config/database.php | Redis host | ⚠️ Default: `127.0.0.1` |
| `REDIS_PORT` | config/database.php | Redis port | ⚠️ Default: `6379` |
| `REDIS_PASSWORD` | config/database.php | Redis password | ✅ Defined | `null` |
| `REDIS_USERNAME` | config/database.php | Redis username | ❌ Not defined (optional) |
| `REDIS_DB` | config/database.php | Redis database number | ⚠️ Default: `0` |
| `REDIS_CACHE_DB` | config/database.php | Redis cache database | ⚠️ Default: `1` |
| `REDIS_CLUSTER` | config/database.php | Redis cluster mode | ⚠️ Default: `redis` |
| `REDIS_PREFIX` | config/database.php | Redis key prefix | ⚠️ Default: `{APP_NAME}-database-` |
| `REDIS_PERSISTENT` | config/database.php | Persistent connection | ⚠️ Default: `false` |
| `REDIS_MAX_RETRIES` | config/database.php | Max reconnection attempts | ⚠️ Default: `3` |
| `REDIS_BACKOFF_ALGORITHM` | config/database.php | Backoff strategy | ⚠️ Default: `decorrelated_jitter` |
| `REDIS_BACKOFF_BASE` | config/database.php | Base backoff time (ms) | ⚠️ Default: `100` |
| `REDIS_BACKOFF_CAP` | config/database.php | Max backoff time (ms) | ⚠️ Default: `1000` |

---

## 8. QUEUE VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `QUEUE_CONNECTION` | config/queue.php | Default queue connection | ⚠️ Default: `database` |
| `DB_QUEUE_CONNECTION` | config/queue.php | Database queue connection | ❌ Not defined |
| `DB_QUEUE_TABLE` | config/queue.php | Jobs table name | ⚠️ Default: `jobs` |
| `DB_QUEUE` | config/queue.php | Queue name | ⚠️ Default: `default` |
| `DB_QUEUE_RETRY_AFTER` | config/queue.php | Retry after (seconds) | ⚠️ Default: `90` |
| `BEANSTALKD_QUEUE_HOST` | config/queue.php | Beanstalkd host | ⚠️ Default: `localhost` |
| `BEANSTALKD_QUEUE` | config/queue.php | Beanstalkd queue | ⚠️ Default: `default` |
| `BEANSTALKD_QUEUE_RETRY_AFTER` | config/queue.php | Beanstalkd retry | ⚠️ Default: `90` |
| `SQS_PREFIX` | config/queue.php | SQS queue URL prefix | ⚠️ Default: Placeholder URL |
| `SQS_QUEUE` | config/queue.php | SQS queue name | ⚠️ Default: `default` |
| `SQS_SUFFIX` | config/queue.php | SQS queue suffix | ❌ Not defined (optional) |
| `QUEUE_FAILED_DRIVER` | config/queue.php | Failed jobs driver | ⚠️ Default: `database-uuids` |
| `REDIS_QUEUE_CONNECTION` | config/queue.php | Redis queue connection | ⚠️ Default: `default` |
| `REDIS_QUEUE` | config/queue.php | Redis queue name | ⚠️ Default: `default` |
| `REDIS_QUEUE_RETRY_AFTER` | config/queue.php | Redis retry after | ⚠️ Default: `90` |

---

## 9. MAIL VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `MAIL_MAILER` | config/mail.php | Default mailer | ✅ Defined | `log` |
| `MAIL_SCHEME` | config/mail.php | SMTP scheme | ✅ Defined | `null` |
| `MAIL_HOST` | config/mail.php | SMTP host | ✅ Defined | `127.0.0.1` |
| `MAIL_PORT` | config/mail.php | SMTP port | ✅ Defined | `2525` |
| `MAIL_USERNAME` | config/mail.php | SMTP username | ✅ Defined | `null` |
| `MAIL_PASSWORD` | config/mail.php | SMTP password | ✅ Defined | `null` |
| `MAIL_URL` | config/mail.php | Full SMTP URL | ❌ Not defined (alternative) |
| `MAIL_ENCRYPTION` | config/mail.php | SMTP encryption | ❌ Not referenced directly |
| `MAIL_FROM_ADDRESS` | config/mail.php | From email address | ✅ Defined | `hello@example.com` |
| `MAIL_FROM_NAME` | config/mail.php | From name | ✅ Defined | `${APP_NAME}` |
| `MAIL_EHLO_DOMAIN` | config/mail.php | EHLO domain | ⚠️ Default: Parsed from APP_URL |
| `MAIL_SENDMAIL_PATH` | config/mail.php | Sendmail binary path | ⚠️ Default: `/usr/sbin/sendmail -bs -i` |
| `MAIL_LOG_CHANNEL` | config/mail.php | Log channel for mail | ❌ Not defined (optional) |
| `POSTMARK_API_KEY` | config/services.php | Postmark API key | ❌ Not defined (optional) |
| `RESEND_API_KEY` | config/services.php | Resend API key | ❌ Not defined (optional) |

---

## 10. AUTHENTICATION VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `AUTH_GUARD` | config/auth.php | Default auth guard | ⚠️ Default: `web` |
| `AUTH_PASSWORD_BROKER` | config/auth.php | Password reset broker | ⚠️ Default: `users` |
| `AUTH_MODEL` | config/auth.php | User model | ⚠️ Default: `App\Models\User::class` |
| `AUTH_PASSWORD_RESET_TOKEN_TABLE` | config/auth.php | Password reset table | ⚠️ Default: `password_reset_tokens` |
| `AUTH_PASSWORD_TIMEOUT` | config/auth.php | Password reset timeout (seconds) | ⚠️ Default: `10800` |

### Sanctum (API Authentication)
| Variable | Used In | Purpose | Status |
|----------|---------|---------|--------|
| `SANCTUM_STATEFUL_DOMAINS` | config/sanctum.php | Stateful domains | ⚠️ Default: Derived from APP_URL |
| `SANCTUM_TOKEN_PREFIX` | config/sanctum.php | Token prefix | ⚠️ Default: Empty string |

---

## 11. FILESYSTEM VARIABLES

| Variable | Used In | Purpose | Status | Default |
|----------|---------|---------|--------|---------|
| `FILESYSTEM_DISK` | config/filesystems.php | Default disk | ✅ Defined | `local` |
| `AWS_ACCESS_KEY_ID` | config/filesystems.php, services.php | AWS access key | ❌ Not defined (optional) |
| `AWS_SECRET_ACCESS_KEY` | config/filesystems.php, services.php | AWS secret key | ❌ Not defined (optional) |
| `AWS_DEFAULT_REGION` | config/filesystems.php, queue.php | AWS region | ✅ Defined | `us-east-1` |
| `AWS_BUCKET` | config/filesystems.php | S3 bucket name | ❌ Not defined (optional) |
| `AWS_URL` | config/filesystems.php | S3 custom URL | ❌ Not defined (optional) |
| `AWS_ENDPOINT` | config/filesystems.php | S3 endpoint (for S3-compatible) | ❌ Not defined (optional) |
| `AWS_USE_PATH_STYLE_ENDPOINT` | config/filesystems.php | Use path-style S3 URLs | ⚠️ Default: `false` |

---

## 12. THIRD-PARTY INTEGRATIONS

### AWS SQS (Queue)
| Variable | Used In | Purpose | Status |
|----------|---------|---------|--------|
| `AWS_ACCESS_KEY_ID` | config/queue.php | AWS access key | ❌ Not defined |
| `AWS_SECRET_ACCESS_KEY` | config/queue.php | AWS secret key | ❌ Not defined |
| `AWS_DEFAULT_REGION` | config/queue.php | AWS region | ✅ Defined |

### Slack
| Variable | Used In | Purpose | Status |
|----------|---------|---------|--------|
| `SLACK_BOT_USER_OAUTH_TOKEN` | config/services.php | Slack bot token | ❌ Not defined |
| `SLACK_BOT_USER_DEFAULT_CHANNEL` | config/services.php | Default Slack channel | ❌ Not defined |
| `LOG_SLACK_WEBHOOK_URL` | config/logging.php | Slack webhook for logs | ❌ Not defined |

---

## Summary Statistics

| Category | Total | Defined | ✅ Used | ⚠️ Has Default | ❌ Not Defined |
|----------|-------|---------|---------|-----------------|----------------|
| Custom/AI | 10 | 6 | 3 | 1 | 7 |
| Database | 12 | 7 | 7 | 5 | 5 |
| Core Laravel | 11 | 9 | 9 | 2 | 2 |
| Logging | 12 | 3 | 3 | 9 | 0 |
| Session | 13 | 1 | 1 | 12 | 0 |
| Cache | 13 | 1 | 1 | 12 | 0 |
| Redis | 15 | 2 | 2 | 13 | 0 |
| Queue | 15 | 0 | 0 | 15 | 0 |
| Mail | 14 | 9 | 9 | 5 | 0 |
| Auth | 8 | 0 | 0 | 8 | 0 |
| Filesystem | 8 | 2 | 2 | 6 | 0 |
| Third-party | 6 | 0 | 0 | 0 | 6 |
| **TOTALS** | **137** | **40** | **37** | **88** | **20** |

---

## ✅ Recommendations for Render Deployment

### Critical (Must Fix Before Deploy)
1. **Remove/Rotate API Keys** – 6 Gemini keys are exposed in `.env`
   - Rotate all keys in Google Cloud Console
   - Add `GEMINI_API_KEY` (single key) to Render's environment variables
   - Remove `GEMINI_API_KEY_1` through `GEMINI_API_KEY_5` from codebase

2. **Add Missing Env Vars to Render Dashboard**
   - `GEMINI_API_KEY` – Your primary Gemini API key
   - `APP_KEY` – Generate with `php artisan key:generate`
   - `DB_*` – All database credentials (already configured for Railway)

3. **Consolidate Gemini API Usage**
   - Update `LogicController` to use `GEMINI_API_KEY` (not `GEMINI_API_KEY_5`)
   - Update routes/api.php test routes to use `GEMINI_API_KEY` (not `GEMINI_API_KEY_3`)
   - Remove unused backup keys

### Important (Best Practice)
4. **Update Configuration for Production**
   - Set `APP_ENV=production` in Render
   - Set `APP_DEBUG=false` in Render
   - Set `LOG_LEVEL=error` or `warning` in Render
   - Set `APP_URL` to your Render deployment URL

5. **Optional Enhancements**
   - Add `OPENROUTER_API_KEY` if using OpenRouter as fallback
   - Configure `SESSION_SECURE_COOKIE=true` for HTTPS
   - Add Slack integration keys if needed (`LOG_SLACK_WEBHOOK_URL`, `SLACK_BOT_USER_OAUTH_TOKEN`)

### Docker Configuration
6. **Dockerfile Issues**
   - Current Dockerfile exposes only port 9000 (FPM) — Render needs HTTP (80/8080)
   - Need to add nginx or another web server
   - Add `.dockerignore` to exclude `.env` and git files

---

## Environment Variables to Use in Routes/Controllers

Replace all `GEMINI_API_KEY_*` with a single `GEMINI_API_KEY`:

```php
// RiddleController.php
$apiKey = env('GEMINI_API_KEY');

// LogicController.php (currently uses GEMINI_API_KEY_5)
$apiKey = env('GEMINI_API_KEY'); // ← Change from GEMINI_API_KEY_5

// routes/api.php test routes (currently use GEMINI_API_KEY_3)
$apiKey = env('GEMINI_API_KEY'); // ← Change from GEMINI_API_KEY_3
```

---

