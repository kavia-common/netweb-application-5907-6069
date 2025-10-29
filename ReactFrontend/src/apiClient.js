//
// Lightweight API client for NetWeb Device Management
// Uses REACT_APP_API_BASE_URL for environment-based configuration
//

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Ensure API base URL is configured.
 * Throws a descriptive error if not found.
 */
function requireBaseUrl() {
  if (!BASE_URL) {
    throw new Error(
      "REACT_APP_API_BASE_URL is not set. Please configure it in your .env file."
    );
  }
}

/**
 * Normalize and parse backend error responses into user-friendly messages.
 * Attempts to read JSON { error, details } shape per OpenAPI; falls back to text.
 */
async function parseError(response) {
  try {
    const data = await response.json();
    if (data && (data.error || data.message)) {
      return data.error || data.message;
    }
    return JSON.stringify(data);
  } catch (_) {
    // If response isn't JSON, fallback to text
    try {
      const text = await response.text();
      return text || `HTTP ${response.status}`;
    } catch {
      return `HTTP ${response.status}`;
    }
  }
}

// PUBLIC_INTERFACE
export async function apiGet(path, { query } = {}) {
  /** Fetch a resource with optional query params */
  requireBaseUrl();
  const url = new URL(`${BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) {
        url.searchParams.set(k, v);
      }
    });
  }
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body) {
  /** POST JSON body and return JSON */
  requireBaseUrl();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  // 201 returns created object
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiPut(path, body) {
  /** PUT JSON body and return JSON */
  requireBaseUrl();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiDelete(path) {
  /** DELETE resource; returns true on success (204 expected) */
  requireBaseUrl();
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }
  return true;
}
