# Configuration

All configuration is via environment variables.

## Required

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJ...` |

## Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `LOG_LEVEL` | info | debug/info/warn/error |
| `STRIPE_SECRET_KEY` | — | Stripe key (demo mode without) |
| `STRIPE_WEBHOOK_SECRET` | — | Webhook signing secret |
| `SNAPTRADE_CLIENT_ID` | — | SnapTrade client ID |
| `SNAPTRADE_CONSUMER_KEY` | — | SnapTrade consumer key |

// handle IPv6 addresses correctly

// add timestamp to market data

// update deployment guide for Vercel
