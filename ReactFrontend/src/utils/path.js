//
// Utilities for building API paths safely with URL-encoding
//

// PUBLIC_INTERFACE
export function devicePathByName(name) {
  /**
   * Build /devices/{name} where {name} is URL-encoded to safely support special characters.
   */
  const safe = encodeURIComponent(String(name ?? "").trim());
  return `/devices/${safe}`;
}
