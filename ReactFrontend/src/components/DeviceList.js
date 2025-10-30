import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiDelete } from "../apiClient";
import { devicePathByName } from "../utils/path";
import "./list.css";

// PUBLIC_INTERFACE
export default function DeviceList({ onCreate, onEdit }) {
  /**
   * Renders the list of devices, supports sorting and filtering via query params.
   * Calls GET /devices?sort=&filter=
   */
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  async function load() {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await apiGet("/devices", { query: { filter, sort } });
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load devices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort]);

  const hasData = useMemo(() => devices && devices.length > 0, [devices]);

  async function handleDelete(name) {
    const confirmed = window.confirm("Are you sure you want to delete this device?");
    if (!confirmed) return;
    try {
      await apiDelete(devicePathByName(name));
      await load();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete device.");
    }
  }

  return (
    <section className="nw-section" aria-label="Device List">
      <div className="nw-controls">
        <div className="nw-field">
          <label htmlFor="filter" className="nw-label">Filter</label>
          <input
            id="filter"
            aria-label="Filter devices"
            className="nw-input"
            type="text"
            placeholder="Search by name, IP, type, or location"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="nw-field">
          <label htmlFor="sort" className="nw-label">Sort By</label>
          <select
            id="sort"
            aria-label="Sort devices"
            className="nw-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="ip_address">IP Address</option>
            <option value="device_type">Device Type</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div className="nw-spacer" />
        <button
          className="nw-btn"
          onClick={onCreate}
          aria-label="Add new device"
        >
          + Add Device
        </button>
      </div>

      {loading && <div role="status" aria-live="polite">Loading devices…</div>}
      {errorMsg && (
        <div className="nw-alert" role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      )}
      {!loading && !hasData && !errorMsg && (
        <p>No devices found. Try adding one.</p>
      )}

      {hasData && (
        <div className="nw-table-wrap" role="region" aria-label="Devices Table">
          <table className="nw-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">IP Address</th>
                <th scope="col">Type</th>
                <th scope="col">Location</th>
                <th scope="col" aria-label="Actions column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.name || d.id} tabIndex={0}>
                  <td>{d.name}</td>
                  <td>{d.ip_address}</td>
                  <td>{d.device_type}</td>
                  <td>{d.location}</td>
                  <td>
                    <div className="nw-row-actions">
                      <button
                        className="nw-btn-secondary"
                        onClick={() => onEdit(d.name)}
                        aria-label={`Edit device ${d.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="nw-btn-danger"
                        onClick={() => handleDelete(d.name)}
                        aria-label={`Delete device ${d.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
