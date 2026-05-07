import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("candidates") || "[]");
    // Sort so pending ones are on top, then by date
    data.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return new Date(b.date) - new Date(a.date);
    });
    setCandidates(data);
  }, []);

  const handleDecision = (candidateId, newStatus) => {
    const updated = candidates.map(c => 
      c.id === candidateId ? { ...c, status: newStatus } : c
    );
    setCandidates(updated);
    localStorage.setItem("candidates", JSON.stringify(updated));
    // Provide some feedback or navigate back to the list
    alert(`Candidate marked as ${newStatus}`);
    navigate("/admin/review");
  };

  const selectedCandidate = id ? candidates.find(c => c.id === id) : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin Panel</p>
            <h1 style={styles.title}>Candidate Review</h1>
          </div>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Admin Dashboard
          </button>
        </div>

        <div style={styles.layout}>
          {/* Left Panel: List of Candidates */}
          <div style={styles.listPanel}>
            <h3 style={styles.sectionTitle}>All Candidates</h3>
            {candidates.length === 0 ? (
              <p style={{ color: "#64748b" }}>No candidates found.</p>
            ) : (
              <div style={styles.list}>
                {candidates.map(c => (
                  <div 
                    key={c.id} 
                    style={{
                      ...styles.listItem,
                      borderLeftColor: c.status === "Approved" ? "#10b981" : c.status === "Rejected" ? "#ef4444" : "#f59e0b",
                      background: id === c.id ? "#f1f5f9" : "#ffffff"
                    }}
                    onClick={() => navigate(`/admin/review/${c.id}`)}
                  >
                    <div>
                      <strong style={{ color: "#1e293b", display: "block" }}>{c.name}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{c.job} · Score: {c.score}/10</span>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      background: c.status === "Approved" ? "#d1fae5" : c.status === "Rejected" ? "#fee2e2" : "#fef3c7",
                      color: c.status === "Approved" ? "#047857" : c.status === "Rejected" ? "#b91c1c" : "#b45309",
                      fontWeight: "bold"
                    }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Detail View */}
          <div style={styles.detailPanel}>
            {!id ? (
              <div style={styles.emptyDetail}>
                <span style={{ fontSize: "40px" }}>👈</span>
                <h3 style={{ color: "#475569" }}>Select a candidate to review</h3>
              </div>
            ) : !selectedCandidate ? (
              <div style={styles.emptyDetail}>
                <h3 style={{ color: "#ef4444" }}>Candidate not found</h3>
              </div>
            ) : (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>{selectedCandidate.name}</h2>
                    <p style={{ margin: 0, color: "#64748b" }}>{selectedCandidate.job} · {selectedCandidate.district}</p>
                  </div>
                  <span style={styles.scoreBadge}>{selectedCandidate.score}/10</span>
                </div>

                <div style={styles.cardBody}>
                  {/* AI Evaluation */}
                  <div style={styles.evalBox}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#4f46e5" }}>🤖 AI Evaluation</h4>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>
                      <strong>Suggestion:</strong> {selectedCandidate.evaluation?.suggestion || "N/A"}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
                      <strong>Reason:</strong> {selectedCandidate.evaluation?.reason || "N/A"}
                    </p>
                    <div style={{ marginTop: "10px", fontSize: "13px" }}>
                      <strong>Fraud Risk:</strong> 
                      <span style={{ marginLeft: "5px", color: selectedCandidate.fraudRiskTier === "safe" ? "green" : "red" }}>
                        {selectedCandidate.fraudRiskTier === "safe" ? "Safe 🟢" : `Risk Level: ${selectedCandidate.fraudRiskTier}`}
                      </span>
                    </div>
                  </div>

                  {/* Answers */}
                  <h4 style={{ margin: "20px 0 10px 0", color: "#1e293b", borderBottom: "1px solid #e2e8f0", paddingBottom: "5px" }}>
                    📝 Interview Answers
                  </h4>
                  {selectedCandidate.allAnswers && selectedCandidate.allAnswers.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {selectedCandidate.allAnswers.map((ans, i) => (
                        <div key={i} style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>
                          <span style={{ fontWeight: "bold", color: "#4f46e5", marginRight: "8px" }}>Q{i+1}:</span>
                          <span style={{ color: "#334155" }}>{ans || "(No answer)"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "14px" }}>No answers recorded.</p>
                  )}

                  {/* Actions */}
                  {selectedCandidate.status === "Pending" ? (
                    <div style={styles.actionRow}>
                      <button 
                        style={{ ...styles.actionBtn, background: "#10b981", color: "#fff" }}
                        onClick={() => handleDecision(selectedCandidate.id, "Approved")}
                      >
                        Accept Candidate ✅
                      </button>
                      <button 
                        style={{ ...styles.actionBtn, background: "#ef4444", color: "#fff" }}
                        onClick={() => handleDecision(selectedCandidate.id, "Rejected")}
                      >
                        Reject Candidate ❌
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: "30px", padding: "15px", borderRadius: "8px", background: selectedCandidate.status === "Approved" ? "#d1fae5" : "#fee2e2", textAlign: "center" }}>
                      <strong style={{ color: selectedCandidate.status === "Approved" ? "#047857" : "#b91c1c" }}>
                        This candidate was {selectedCandidate.status}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
  },
  eyebrow: {
    margin: "0 0 5px 0",
    color: "#6366f1",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "12px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#0f172a",
  },
  backBtn: {
    background: "#fff",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#475569",
    transition: "background 0.2s",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  listPanel: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    padding: "20px",
    height: "calc(100vh - 150px)",
    overflowY: "auto",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    fontSize: "16px",
    color: "#1e293b",
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "10px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    borderLeftWidth: "4px",
    cursor: "pointer",
    transition: "transform 0.1s, box-shadow 0.1s",
  },
  detailPanel: {
    minHeight: "400px",
  },
  emptyDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    padding: "24px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreBadge: {
    background: "rgba(255,255,255,0.2)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "18px",
    backdropFilter: "blur(4px)",
  },
  cardBody: {
    padding: "30px",
  },
  evalBox: {
    background: "#e0e7ff",
    border: "1px solid #c7d2fe",
    borderRadius: "12px",
    padding: "20px",
  },
  actionRow: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "25px",
  },
  actionBtn: {
    flex: 1,
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "opacity 0.2s",
  }
};
