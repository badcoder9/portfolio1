import React, { useRef, useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #0003",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
        aria-label="Login form"
      >
        <h1 style={{
          fontWeight: 700,
          fontSize: 28,
          margin: 0,
          color: "#181a1b",
          textAlign: "center",
          letterSpacing: 0.5,
        }}>
          Log In
        </h1>
        {error && (
          <div
            role="alert"
            style={{
              background: "#ffeaea",
              color: "#b00020",
              borderRadius: 4,
              padding: "10px 12px",
              fontSize: 15,
              fontWeight: 500,
              marginBottom: -10,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <label style={{ color: "#181a1b", fontWeight: 600, fontSize: 15 }}>
          Email
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            required
            aria-required="true"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 10px",
              border: "1px solid #d7d7d7",
              borderRadius: 4,
              background: "#f9fafb",
              color: "#181a1b",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            autoComplete="username"
          />
        </label>
        <label style={{ color: "#181a1b", fontWeight: 600, fontSize: 15 }}>
          Password
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
            aria-required="true"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px 10px",
              border: "1px solid #d7d7d7",
              borderRadius: 4,
              background: "#f9fafb",
              color: "#181a1b",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 0",
            background: loading ? "#1976d2aa" : "#1976d2",
            color: "#fff",
            border: 0,
            borderRadius: 4,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: 0.5,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8,
            transition: "background 0.2s",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <style>{`
        @media (max-width: 600px) {
          form[aria-label="Login form"] {
            padding: 18px !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}