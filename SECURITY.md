# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.5.x | Yes |
| 0.4.x | Yes |
| < 0.4 | No |

## Reporting a vulnerability

**Do not open a public issue.**

Email **security@elgonrpc.xyz** with a description, reproduction steps and the
impact you expect. We aim to acknowledge within 48 hours.

## In scope

- API key validation and authorization
- Rate-limit bypasses that enable sustained abuse
- Stripe webhook signature verification
- The SnapTrade connection flow and anything touching brokerage data
- Input validation on any `/api/v1` endpoint

## Out of scope

- Accuracy or freshness of upstream market data — quotes are delayed by design
- Sandbox endpoints returning simulated values; this is documented behaviour
- Throughput of the shared sandbox key, which is best effort
- Vulnerabilities in dependencies — please report those upstream
