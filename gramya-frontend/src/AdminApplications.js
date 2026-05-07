import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AIJobsSection from "./AIJobsSection";

const API = "https://gramya-ai.onrender.com/api/v1";

const statusClass = (status) => {
  switch (status) {
    case "Selected":
      return "selected";
    case "Rejected":
      return "rejected";
    case "Interview Scheduled":
      return "interview";
    case "Under Review":
      return "review";
    default:
      return "pending";
  }
};

/* ── Review Modal ─────────────────────────────────────────────────────────── */
function ReviewModal({ app, onApprove, onReject, onClose }) {
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleApprove = () => {
    setConfirmed(true);
    onApprove(app, note);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          position: "relative",
          fontFamily: "inherit",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="review-modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#9ca3af",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <p
          style={{
            margin: "0 0 4px",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#6b7280",
            letterSpacing: 1,
          }}
        >
          Admin Review
        </p>

        <h2
          style={{
            margin: "0 0 4px",
            fontSize: 20,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          👤 {app.user_name}
        </h2>

        <p style={{ margin: "0 0 2px", fontSize: 13, color: "#6b7280" }}>
          💼 {app.job_title} · 📍 {app.user_location}
        </p>

        <p style={{ margin: "0 0 2px", fontSize: 13, color: "#6b7280" }}>
          🛠 {app.user_skills} · ⏱ {app.experience_years} yr exp
        </p>

        <span
          className={`tracker-status-badge ${statusClass(app.status)}`}
          style={{
            display: "inline-block",
            marginTop: 8,
            marginBottom: 20,
          }}
        >
          {app.status}
        </span>

        {app.answers?.length > 0 && (
          <div
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 18,
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontWeight: 700,
                fontSize: 13,
                color: "#374151",
              }}
            >
              📝 Application Answers
            </p>

            {app.answers.map((ans, i) => (
              <p
                key={i}
                style={{
                  margin: "0 0 6px",
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                <strong>Q{i + 1}:</strong> {ans}
              </p>
            ))}

            {app.cover_note && (
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#374151" }}>
                <strong>Cover Note:</strong> {app.cover_note}
              </p>
            )}
          </div>
        )}

        <input
          id="review-modal-note"
          placeholder="Add an admin note (optional)…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
            marginBottom: 20,
            color: "#111827",
          }}
        />

        {confirmed && (
          <div
            style={{
              background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
              border: "1.5px solid #34d399",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 24 }}>🎉</span>

            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#065f46",
                }}
              >
                Candidate Selected!
              </p>

              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 13,
                  color: "#047857",
                }}
              >
                {app.user_name} has been marked as Selected for{" "}
                {app.job_title}.
              </p>
            </div>
          </div>
        )}

        {!confirmed && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              id="review-modal-approve"
              onClick={handleApprove}
              style={{
                flex: 1,
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ✅ Approve
            </button>

            <button
              id="review-modal-reject"
              onClick={() => {
                onReject(app, note);
                onClose();
              }}
              style={{
                flex: 1,
                padding: "13px 0",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#dc2626,#ef4444)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ❌ Reject
            </button>
          </div>
        )}

        {confirmed && (
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Done ✓
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export default function AdminApplications() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandId, setExpandId] = useState(null);
  const [reviewApp, setReviewApp] = useState(null);
  const [toast, setToast] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/login");
      return;
    }

    loadApps();
  }, [role, navigate]);

  const loadApps = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/admin/applications`);

      if (res.ok) {
        setApps(await res.json());
        setLoading(false);
        return;
      }
    } catch {}

    const all = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    setApps(
      all.sort(
        (a, b) =>
          new Date(b.applied_at) - new Date(a.applied_at)
      )
    );

    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const updateStatus = async (app, newStatus, note = "") => {
    try {
      const res = await fetch(`${API}/admin/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: app.id,
          status: newStatus,
          admin_note: note,
        }),
      });

      if (res.ok) {
        await loadApps();
        showToast(`✅ Moved to "${newStatus}"`);
        return;
      }
    } catch {}

    showToast(`Updated to ${newStatus}`);
  };

  const handleApprove = (app, note) => {
    updateStatus(app, "Selected", note);
  };

  const handleReject = (app, note) => {
    updateStatus(app, "Rejected", note);
  };

  return (
    <div className="admin-apps-page">
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a2e",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 50,
            fontWeight: 600,
            fontSize: 14,
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}

      {reviewApp && (
        <ReviewModal
          app={reviewApp}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => {
            setReviewApp(null);
            loadApps();
          }}
        />
      )}

      <div className="admin-apps-header">
        <h1 className="admin-apps-title">
          📋 Application Reviews
        </h1>
      </div>

      <div className="admin-apps-table">
        {apps.map((app) => {
          const expanded = expandId === app.id;

          return (
            <div
              key={app.id}
              className="admin-app-row"
              style={{ display: "block" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <div>
                  <p className="admin-app-row__name">
                    👤 {app.user_name}
                  </p>

                  <p className="admin-app-row__job">
                    💼 {app.job_title}
                  </p>

                  <span
                    className={`tracker-status-badge ${statusClass(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="admin-app-row__actions">
                  <button
                    onClick={() =>
                      setExpandId(
                        expanded ? null : app.id
                      )
                    }
                  >
                    {expanded ? "Hide" : "View"}
                  </button>

                  <button
                    onClick={() => setReviewApp(app)}
                  >
                    Review
                  </button>
                </div>
              </div>

              {expanded && (
                <div style={{ marginTop: 12 }}>
                  <div className="admin-app-answers">
                    <h4>📝 Application Answers</h4>

                    {app.answers?.map((ans, i) => (
                      <p key={i}>
                        <strong>Q{i + 1}:</strong> {ans}
                      </p>
                    ))}

                    {app.cover_note && (
                      <p>
                        <strong>Cover Note:</strong>{" "}
                        {app.cover_note}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AIJobsSection />
    </div>
  );
}
