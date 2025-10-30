//
// Form validators for device inputs
//

// PUBLIC_INTERFACE
export function isIPv4(ip) {
  /** Validate an IPv4 address (0-255 each octet) */
  if (typeof ip !== "string") return false;
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    if (p.length > 1 && p.startsWith("0")) return false; // avoid leading zeros ambiguity
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

// PUBLIC_INTERFACE
export function validateDevice({ name, ip_address, device_type, location }) {
  /**
   * Validate device fields and return an errors object keyed by field.
   */
  const errors = {};
  if (!name || !String(name).trim()) {
    errors.name = "Name is required and must be unique.";
  }
  if (!ip_address || !String(ip_address).trim()) {
    errors.ip_address = "IP address is required.";
  } else if (!isIPv4(ip_address)) {
    errors.ip_address = "IP address must be a valid IPv4 address (e.g., 192.168.1.10).";
  }
  const allowed = ["router", "switch", "server"];
  if (!device_type || !allowed.includes(device_type)) {
    errors.device_type = "Device type is required (router, switch, or server).";
  }
  if (!location || !String(location).trim()) errors.location = "Location is required.";
  return errors;
}
