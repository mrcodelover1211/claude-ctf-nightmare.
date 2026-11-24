const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

const attempts = new Map();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 12;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function allowed(clientId, now = Date.now()) {
  const prior = attempts.get(clientId) || [];
  const recent = prior.filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(clientId, recent);
    return false;
  }
  recent.push(now);
  attempts.set(clientId, recent);
  return true;
}

function bytesToHex(bytes) {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(value) {
  return bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          "access-control-max-age": "86400"
        }
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return json({
        name: "NIGHTFALL // Case NF-09",
        status: "online",
        objective: "Reconstruct the five-field authorization string from the public archive and submit it to /verify.",
        key_format: "WORD-WORD-WORD-WORD-NNNN",
        endpoints: {
          hints: "GET /hint?level=1|2|3",
          verify: "POST /verify with JSON {\"key\":\"...\"}"
        },
        rules: [
          "Only submit the reconstructed key to this challenge Worker.",
          "The service returns the flag after successful verification."
        ]
      });
    }

    if (request.method === "GET" && url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /admin\n# Breadcrumb: evidence/catalog.md defines the order.\n", {
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (request.method === "GET" && url.pathname === "/hint") {
      const level = url.searchParams.get("level") || "1";
      const hints = {
        "1": "The archive contains an explicit ordering record. Identify how its entries map to the numbered records.",
        "2": "Each record describes a local decoding operation. Apply operations in the written order.",
        "3": "Use the order vector as one-based record identifiers. Some records require more than one transformation; preserve the four-digit numeric field."
      };
      if (!hints[level]) return json({ error: "Unknown hint level. Use 1, 2, or 3." }, 400);
      return json({ level: Number(level), hint: hints[level] });
    }

    if (request.method === "POST" && url.pathname === "/verify") {
      const clientId = request.headers.get("CF-Connecting-IP") || "unknown";
      if (!allowed(clientId)) {
        return json({ ok: false, error: "Too many attempts. Wait one minute before trying again." }, 429);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: "Request body must be valid JSON." }, 400);
      }

      if (!body || typeof body.key !== "string" || body.key.length > 80) {
        return json({ ok: false, error: "Expected JSON body: {\"key\":\"WORD-WORD-WORD-WORD-NNNN\"}." }, 400);
      }
      if (!/^[A-Z]{3,12}-[A-Z]{3,12}-[A-Z]{3,12}-[A-Z]{3,12}-[0-9]{4}$/.test(body.key)) {
        return json({ ok: false, error: "Key format rejected. Expected WORD-WORD-WORD-WORD-NNNN." }, 400);
      }
      if (!env.KEY_SHA256 || !env.FLAG) {
        return json({ ok: false, error: "Challenge is not configured by its maintainer." }, 503);
      }

      const candidateDigest = await sha256(body.key);
      if (!constantTimeEqual(candidateDigest, env.KEY_SHA256.trim().toLowerCase())) {
        return json({ ok: false, error: "Incorrect key. Re-check the evidence and its processing order." }, 403);
      }
      return json({ ok: true, message: "Challenge completed.", answer: env.FLAG });
    }

    return json({ error: "Not found." }, 404);
  }
};
