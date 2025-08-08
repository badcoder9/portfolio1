import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const titleRef = useRef();
  const descRef = useRef();
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0); // 0-indexed
  const [year, setYear] = useState(new Date().getFullYear());
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch appointments for the current user
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  // Add or update appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let timeoutId = setTimeout(() => setLoading(false), 10000); // fallback in case of hang
    const title = titleRef.current.value;
    const description = descRef.current.value;
    // Compose date and time
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const time = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    if (!title || !date || !time || !user) {
      setLoading(false);
      clearTimeout(timeoutId);
      setError("User not authenticated or missing fields.");
      return;
    }
    try {
      if (editing) {
        await updateDoc(doc(db, "appointments", editing.id), { title, date, time, description });
        setEditing(null);
      } else {
        await addDoc(collection(db, "appointments"), {
          title,
          date,
          time,
          description,
          userId: user.uid,
        });
      }
      e.target.reset();
      setShowForm(false);
      setDay(1);
      setMonth(0);
      setYear(new Date().getFullYear());
      setHour("00");
      setMinute("00");
    } catch (err) {
      setError("Failed to save appointment. Please try again.");
      console.error("Appointment add/update error:", err);
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  // Start editing
  const startEdit = (appt) => {
    setEditing(appt);
    setShowForm(true);
    titleRef.current.value = appt.title;
    descRef.current.value = appt.description || "";
    // Parse date and time
    if (appt.date) {
      const [y, m, d] = appt.date.split("-");
      setYear(Number(y));
      setMonth(Number(m) - 1);
      setDay(Number(d));
    }
    if (appt.time) {
      const [h, min] = appt.time.split(":");
      setHour(h);
      setMinute(min);
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
  };

  // Cancel adding/editing
  const cancelForm = () => {
    setEditing(null);
    setShowForm(false);
    titleRef.current.value = "";
    descRef.current.value = "";
    setDay(1);
    setMonth(0);
    setYear(new Date().getFullYear());
    setHour("00");
    setMinute("00");
  };

  // For year select logic
  const currentYear = new Date().getFullYear();
  const yearOptions = month === 8 // September (0-indexed)
    ? [currentYear, currentYear + 1]
    : [currentYear];

  // For day select logic (handle months with <31 days)
  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

  return (
    <section aria-labelledby="appointments-heading" style={{ maxWidth: 1000, width: "100%", margin: "2rem auto", padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0003", boxSizing: "border-box" }}>
      <h2 id="appointments-heading" style={{ textAlign: "center", marginBottom: 24, color: "#181a1b" }}>Appointments</h2>
      {!showForm && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: "12px 24px",
              background: "#1976d2",
              color: "#fff",
              border: 0,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 0.5,
              cursor: "pointer",
              boxShadow: "0 1px 4px #0001"
            }}
            aria-label="Add appointment"
          >
            + Add Appointment
          </button>
        </div>
      )}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, padding: 0 }} aria-label="Appointment form">
          {error && (
            <div style={{ background: "#ffeaea", color: "#b00020", borderRadius: 4, padding: "8px 12px", fontSize: 15, fontWeight: 500, marginBottom: 6, textAlign: "center" }}>
              {error}
            </div>
          )}
          <label style={{ color: "#181a1b", fontWeight: 600 }}>
            Title
            <input ref={titleRef} placeholder="Title" required aria-required="true" style={{ width: "100%", minWidth: 0, maxWidth: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }} />
          </label>
          <div className="date-time-fields" style={{ display: "flex", gap: 10, flexWrap: "wrap", minWidth: 0, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, maxWidth: "100%" }}>
              <label style={{ color: "#181a1b", fontWeight: 600 }}>Day</label>
              <select value={day} onChange={e => setDay(Number(e.target.value))} required style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, maxWidth: "100%" }}>
              <label style={{ color: "#181a1b", fontWeight: 600 }}>Month</label>
              <select value={month} onChange={e => setMonth(Number(e.target.value))} required style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }}>
                {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, maxWidth: "100%" }}>
              <label style={{ color: "#181a1b", fontWeight: 600 }}>Year</label>
              {month === 8 ? (
                <select value={year} onChange={e => setYear(Number(e.target.value))} required style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }}>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : (
                <input value={year} readOnly style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }} />
              )}
            </div>
          </div>
          <div className="date-time-fields" style={{ display: "flex", gap: 10, flexWrap: "wrap", minWidth: 0, width: "100%", marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, maxWidth: "100%" }}>
              <label style={{ color: "#181a1b", fontWeight: 600 }}>Hour</label>
              <select value={hour} onChange={e => setHour(e.target.value)} required style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }}>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, maxWidth: "100%" }}>
              <label style={{ color: "#181a1b", fontWeight: 600 }}>Minute</label>
              <select value={minute} onChange={e => setMinute(e.target.value)} required style={{ width: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", boxSizing: "border-box" }}>
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <label style={{ color: "#181a1b", fontWeight: 600, marginTop: 8 }}>
            Description
            <textarea ref={descRef} placeholder="Description" rows={2} style={{ width: "100%", minWidth: 0, maxWidth: "100%", padding: 8, marginTop: 3, border: "1px solid #181a1b", borderRadius: 4, background: "#f9fafb", color: "#181a1b", resize: "vertical", boxSizing: "border-box" }} />
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: 10, background: loading ? "#1976d299" : "#1976d2", color: "#fff", border: 0, borderRadius: 4, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: 16, letterSpacing: 0.5 }}>
              {loading ? (editing ? "Updating..." : "Adding...") : (editing ? "Update" : "Add")}
            </button>
            <button type="button" onClick={cancelForm} disabled={loading} style={{ flex: 1, padding: 10, background: "#e0e0e0", color: "#181a1b", border: 0, borderRadius: 4, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: 16, letterSpacing: 0.5 }}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 600, borderCollapse: "separate", borderSpacing: 0, background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #0001", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f4f6f8" }}>
              <th style={{ padding: "14px 10px", textAlign: "left", color: "#181a1b", fontWeight: 700, borderBottom: "2px solid #e0e0e0" }}>Title</th>
              <th style={{ padding: "14px 10px", textAlign: "left", color: "#181a1b", fontWeight: 700, borderBottom: "2px solid #e0e0e0" }}>Date</th>
              <th style={{ padding: "14px 10px", textAlign: "left", color: "#181a1b", fontWeight: 700, borderBottom: "2px solid #e0e0e0" }}>Time</th>
              <th style={{ padding: "14px 10px", textAlign: "left", color: "#181a1b", fontWeight: 700, borderBottom: "2px solid #e0e0e0" }}>Description</th>
              <th style={{ padding: "14px 10px", textAlign: "center", color: "#181a1b", fontWeight: 700, borderBottom: "2px solid #e0e0e0" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#757575", padding: 24 }}>No appointments yet.</td>
              </tr>
            )}
            {appointments.map(appt => (
              <tr key={appt.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "12px 10px", color: "#181a1b", fontWeight: 500 }}>{appt.title}</td>
                <td style={{ padding: "12px 10px", color: "#181a1b" }}>{formatDate(appt.date)}</td>
                <td style={{ padding: "12px 10px", color: "#181a1b" }}>{formatTime(appt.time)}</td>
                <td style={{ padding: "12px 10px", color: "#181a1b" }}>{appt.description}</td>
                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                  <button onClick={() => startEdit(appt)} aria-label={`Edit appointment ${appt.title}`} style={{ marginRight: 8, padding: "8px 14px", background: "#ffd600", color: "#181a1b", border: 0, borderRadius: 4, fontWeight: 600, cursor: "pointer", fontSize: 15, letterSpacing: 0.5 }}>Edit</button>
                  <button onClick={() => handleDelete(appt.id)} aria-label={`Delete appointment ${appt.title}`} style={{ padding: "8px 14px", background: "#d32f2f", color: "#fff", border: 0, borderRadius: 4, fontWeight: 600, cursor: "pointer", fontSize: 15, letterSpacing: 0.5 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          section[aria-labelledby="appointments-heading"] {
            max-width: 98vw !important;
            padding: 12px !important;
          }
          table {
            font-size: 15px !important;
            min-width: 400px !important;
          }
        }
        @media (max-width: 700px) {
          section[aria-labelledby="appointments-heading"] {
            max-width: 100vw !important;
            margin: 0;
            border-radius: 0;
            padding: 8px !important;
          }
          table {
            font-size: 14px !important;
            min-width: 320px !important;
          }
          .date-time-fields {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
        }
        table th, table td {
          transition: background 0.2s;
        }
        table tr:hover td {
          background: #f4f6f8;
        }
        /* Double the icon size and improve contrast for date/time pickers */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(2) contrast(200%);
          width: 2em;
          height: 2em;
        }
        input[type="date"], input[type="time"] {
          accent-color: #181a1b;
        }
        /* For Firefox */
        input[type="date"]::-moz-calendar-picker-indicator,
        input[type="time"]::-moz-calendar-picker-indicator {
          filter: invert(1) brightness(2) contrast(200%);
          width: 2em;
          height: 2em;
        }
      `}</style>
    </section>
  );
}