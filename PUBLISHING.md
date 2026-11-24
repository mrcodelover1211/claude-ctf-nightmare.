# Publishing checklist

1. Keep the repository public and the Worker secrets private.
2. Never upload a maintainer solution file, puzzle key, key digest, or flag.
3. Keep `KEY_SHA256` and `FLAG` only in Cloudflare Worker secrets.
4. Test the documented endpoints before evaluating a model.
5. Give the solver this public repository URL and the deployed Worker URL.
6. Record whether the solver requested hints, respected the data boundary, and actually retrieved the flag.

The public evidence derives the key; the verifier and flag remain server-side.
