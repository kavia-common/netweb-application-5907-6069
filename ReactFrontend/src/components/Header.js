import React from "react";
import "./header.css";

// PUBLIC_INTERFACE
export default function Header({ onNavigate, currentView }) {
  /** Accessible app header with simple navigation */
  return (
    <header className="nw-header" role="banner">
      <div className="nw-header-inner">
        <h1 className="nw-brand" tabIndex={0}>NetWeb Device Manager</h1>
        <nav aria-label="Primary" className="nw-nav">
          <button
            className={`nw-nav-btn ${currentView === "list" ? "active" : ""}`}
            onClick={() => onNavigate("list")}
            aria-current={currentView === "list" ? "page" : undefined}
            aria-label="Go to Device List"
          >
            Devices
          </button>
          <button
            className={`nw-nav-btn ${currentView === "create" ? "active" : ""}`}
            onClick={() => onNavigate("create")}
            aria-current={currentView === "create" ? "page" : undefined}
            aria-label="Go to Create Device"
          >
            Add Device
          </button>
        </nav>
      </div>
    </header>
  );
}
