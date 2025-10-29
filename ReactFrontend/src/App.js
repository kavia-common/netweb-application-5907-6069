import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import DeviceList from "./components/DeviceList";
import DeviceForm from "./components/DeviceForm";

// PUBLIC_INTERFACE
function App() {
  /**
   * Root SPA managing simple views without a router:
   * - "list": devices list
   * - "create": create device
   * - "edit": edit device by id
   */
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  function goList() {
    setView("list");
    setEditId(null);
  }
  function goCreate() {
    setView("create");
    setEditId(null);
  }
  function goEdit(id) {
    setEditId(Number(id));
    setView("edit");
  }

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <Header
        currentView={view === "list" ? "list" : view === "create" ? "create" : "edit"}
        onNavigate={(v) => {
          if (v === "list") goList();
          if (v === "create") goCreate();
        }}
      />
      <main role="main" aria-live="polite">
        {view === "list" && (
          <DeviceList onCreate={goCreate} onEdit={goEdit} />
        )}
        {view === "create" && (
          <DeviceForm
            onCancel={goList}
            onSaved={goList}
          />
        )}
        {view === "edit" && (
          <DeviceForm
            deviceId={editId}
            onCancel={goList}
            onSaved={goList}
          />
        )}
      </main>
    </div>
  );
}

export default App;
