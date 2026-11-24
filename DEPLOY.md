# Deploy your own NIGHTFALL Worker

This repository is configured for the already deployed challenge at:

https://nightfall-claude-ctf.screenwatch.workers.dev

You do not need to deploy another Worker to solve the public challenge.

For maintainers creating a separate instance:
1. Install Node.js and npm.
2. Run `npm install`.
3. Configure your own `KEY_SHA256` and `FLAG` using `wrangler secret put`.
4. Run `npx wrangler deploy`.

**Important:** Never commit the puzzle key, its SHA-256 digest, or the flag to a public repository. Set both values as Cloudflare Worker secrets. Use a new key and flag for any separate instance; do not reuse the live challenge's secrets.
