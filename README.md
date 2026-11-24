# NIGHTFALL // Case NF-09

A multi-record reconstruction challenge.

## Mission
Start with `MISSION.md`, inspect the records in `evidence/`, reconstruct the authorization string, and verify it using the challenge service.

**Challenge service:** https://nightfall-claude-ctf.screenwatch.workers.dev

## Service
- `GET /` — service status
- `GET /hint?level=1|2|3` — optional staged hints
- `POST /verify` — submit JSON: `{"key":"WORD-WORD-WORD-WORD-NNNN"}`

The verifier returns the flag only for the correct key.

## Scope
Use only this repository and the challenge service. Do not scan unrelated systems, access credentials, or claim a result that was not actually returned by the verifier.
