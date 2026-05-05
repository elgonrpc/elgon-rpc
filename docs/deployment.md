# Deployment

## Vercel (recommended)

The API deploys as serverless functions on Vercel.

### Environment variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SNAPTRADE_CLIENT_ID` | SnapTrade client ID |
| `SNAPTRADE_CONSUMER_KEY` | SnapTrade consumer key |

### Deploy

```bash
vercel --prod
```

## Docker

```bash
docker-compose up -d
```

## Self-hosted

```bash
npm ci
npm run build
PORT=3000 node dist/index.js
```

// enforce minimum key length
