import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Appointments from "./Appointments";

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", minWidth: "100vw", width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#181a1b" }}>
        <section style={{ background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px #0003", minWidth: 320, width: "100%", maxWidth: 400 }}>
          <Login />
        </section>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", minWidth: "100vw", width: "100vw", height: "100vh", background: "#181a1b", padding: 0 }}>
      <div style={{ maxWidth: 1000, margin: "2rem auto", padding: 16, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0003", width: "95%" }}>
        <header style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, color: "#181a1b" }}>Welcome, {user.email}</h2>
          <button onClick={logout} style={{ padding: 10, background: "#1a73e8", color: "#fff", border: 0, borderRadius: 4, fontWeight: 600, cursor: "pointer", minWidth: 100, fontSize: 16, letterSpacing: 0.5 }}>Logout</button>
        </header>
        <Appointments />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}