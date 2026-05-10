# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in the Elgon RPC SDK, please report it
responsibly:

1. **Do not** open a public GitHub issue
2. Email **security@elgonrpc.xyz** with:
   - Description of the vulnerability
   - Steps to reproduce
   - SDK version and environment
3. You will receive a response within 48 hours

## Scope

- Receipt verification bypass (signature forgery, digest collision)
- Key extraction from SDK internals
- Denial of service via crafted inputs
- Dependency vulnerabilities in `@noble/ed25519`, `@noble/hashes`, `bs58`

## Out of scope

- Endpoint availability (server-side, not SDK)
- Rate limiting behavior
- Issues in development dependencies
