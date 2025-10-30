import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../apiClient";
import { validateDevice } from "../utils/validators";
import { devicePathByName } from "../utils/path";
import "./form.css";

/**
 * PUBLIC_INTERFACE
 * DeviceForm can create or edit a device.
 * - If deviceName is provided, it will fetch current values via GET /devices/{name}.
 * - On submit, it will POST (create) or PUT (update).
 */
export default function DeviceForm({ deviceName, onCancel, onSaved }) {
  const isEdit = typeof deviceName === "string" && String(deviceName).trim().length > 0;

  const [values, setValues] = useState({
    name: "",
    ip_address: "",
    device_type: "router",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!isEdit) return;
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await apiGet(devicePathByName(deviceName));
        if (!ignore) {
          setValues({
            name: data.name ?? "",
            ip_address: data.ip_address ?? "",
            device_type: data.device_type ?? "router",
            location: data.location ?? "",
          });
        }
      } catch (err) {
        if (!ignore) setErrorMsg(err.message || "Failed to load device.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [isEdit, deviceName]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    const vErrors = validateDevice(values);
    setErrors(vErrors);
    if (Object.keys(vErrors).length > 0) return;

    setSaving(true);
    try {
      if (isEdit) {
        await apiPut(devicePathByName(deviceName), values);
      } else {
        await apiPost("/devices", values);
      }
      onSaved?.();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save device.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="nw-section" aria-label={isEdit ? "Edit Device" : "Create Device"}>
      <h2>{isEdit ? "Edit Device" : "Create Device"}</h2>
      {loading ? (
        <div role="status" aria-live="polite">Loading…</div>
      ) : (
        <form className="nw-form" onSubmit={handleSubmit} noValidate>
          {errorMsg && <div className="nw-alert" role="alert">{errorMsg}</div>}

          <div className="nw-form-row">
            <label htmlFor="name" className="nw-label">Name</label>
            <input
              id="name"
              name="name"
              className={`nw-input ${errors.name ? "invalid" : ""}`}
              value={values.name}
              onChange={handleChange}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="Core Router A"
            />
            {errors.name && (
              <div id="name-error" className="nw-error" role="alert">
                {errors.name}
              </div>
            )}
            <p className="nw-label" style={{ marginTop: 0, fontSize: "0.85rem", color: "#555" }}>
              Note: Name must be unique and non-empty. Special characters are allowed.
            </p>
          </div>

          <div className="nw-form-row">
            <label htmlFor="ip_address" className="nw-label">IP Address</label>
            <input
              id="ip_address"
              name="ip_address"
              className={`nw-input ${errors.ip_address ? "invalid" : ""}`}
              value={values.ip_address}
              onChange={handleChange}
              required
              aria-invalid={!!errors.ip_address}
              aria-describedby={errors.ip_address ? "ip-error" : undefined}
              inputMode="numeric"
              placeholder="192.168.1.10"
            />
            {errors.ip_address && (
              <div id="ip-error" className="nw-error" role="alert">
                {errors.ip_address}
              </div>
            )}
          </div>

          <div className="nw-form-row">
            <label htmlFor="device_type" className="nw-label">Device Type</label>
            <select
              id="device_type"
              name="device_type"
              className={`nw-input ${errors.device_type ? "invalid" : ""}`}
              value={values.device_type}
              onChange={handleChange}
              required
              aria-invalid={!!errors.device_type}
              aria-describedby={errors.device_type ? "type-error" : undefined}
            >
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="server">Server</option>
            </select>
            {errors.device_type && (
              <div id="type-error" className="nw-error" role="alert">
                {errors.device_type}
              </div>
            )}
          </div>

          <div className="nw-form-row">
            <label htmlFor="location" className="nw-label">Location</label>
            <input
              id="location"
              name="location"
              className={`nw-input ${errors.location ? "invalid" : ""}`}
              value={values.location}
              onChange={handleChange}
              required
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
              placeholder="Data Center 1"
            />
            {errors.location && (
              <div id="location-error" className="nw-error" role="alert">
                {errors.location}
              </div>
            )}
          </div>

          <div className="nw-form-actions">
            <button type="submit" className="nw-btn" disabled={saving} aria-label="Save device">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" className="nw-btn-secondary" onClick={onCancel} aria-label="Cancel">
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
