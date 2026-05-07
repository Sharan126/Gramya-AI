import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const candidates = JSON.parse(localStorage.getItem("candidates") || "[]");
    const found = candidates.find((c) => c.id === id);
    setCandidate(found);
  }, [id]);

  if (!candidate) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={{ color: "#ef4444" }}>Candidate Not Found</h2>
          <p>We couldn't find the interview data you are looking for.</p>
          <button style={styles.backBtn} onClick={() => navigate("/UserDashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isApproved = candidate.status === "Approved";
  const isRejected = candidate.status === "Rejected";
  const isPending = !isApproved && !isRejected;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/UserDashboard")}>
          ← Back to Dashboard
        </button>

        <div style={styles.card}>
          {/* Status Header */}
          <div style={{ ...styles.statusBanner, ...(isApproved ? styles.approvedBanner : isRejected ? styles.rejectedBanner : styles.pendingBanner) }}>
            <h2>
              {isApproved && "Approved ✅"}
              {isRejected && "Rejected ❌"}
              {isPending && "Decision Pending ⏳"}
            </h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
              {isApproved && "Congratulations! You have been selected."}
              {isRejected && "Unfortunately, your application was not selected."}
              {isPending && "Your interview is currently under admin review."}
            </p>
          </div>

          <div style={styles.grid}>
            {/* Left Column: Info */}
            <div style={styles.col}>
              <h3 style={styles.sectionTitle}>Candidate Information</h3>
              <div style={styles.infoRow}><span style={styles.label}>Name:</span> <span style={styles.value}>{candidate.name}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Job Role:</span> <span style={styles.value}>{candidate.job}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>District:</span> <span style={styles.value}>{candidate.district}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Date:</span> <span style={styles.value}>{new Date(candidate.date).toLocaleString()}</span></div>

              <h3 style={{ ...styles.sectionTitle, marginTop: "24px" }}>Evaluation</h3>
              <div style={styles.infoRow}><span style={styles.label}>Score:</span> <span style={styles.scoreBadge}>{candidate.score} / 10</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Fraud Status:</span> <span style={styles.value}>{candidate.fraudRiskTier === "safe" ? "Safe 🟢" : `Risk: ${candidate.fraudRiskTier}`}</span></div>
              
              {candidate.evaluation && (
                <div style={{ marginTop: "16px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
                  <strong>AI Evaluation:</strong>
                  <p style={{ fontSize: "14px", color: "#475569", marginTop: "8px" }}>{candidate.evaluation.suggestion}</p>
                  <p style={{ fontSize: "14px", color: "#475569" }}>{candidate.evaluation.reason}</p>
                </div>
              )}
            </div>

            {/* Right Column: Answers */}
            <div style={styles.col}>
              <h3 style={styles.sectionTitle}>Interview Answers</h3>
              {candidate.allAnswers && candidate.allAnswers.length > 0 ? (
                <div style={styles.answersContainer}>
                  {candidate.allAnswers.map((ans, i) => (
                    <div key={i} style={styles.answerBox}>
                      <span style={styles.qNum}>Q{i + 1}</span>
                      <p style={styles.answerText}>{ans || "(No answer provided)"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#9ca3af", fontStyle: "italic" }}>No answers recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(79, 70, 229, 0.1)",
    overflow: "hidden",
    marginTop: "20px",
  },
  statusBanner: {
    padding: "30px",
    color: "#ffffff",
    textAlign: "center",
  },
  pendingBanner: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  approvedBanner: {
    background: "linear-gradient(135deg, #10b981, #059669)",
  },
  rejectedBanner: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "30px",
    padding: "30px",
  },
  col: {
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  label: {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "15px",
  },
  value: {
    fontWeight: "500",
    color: "#0f172a",
    fontSize: "15px",
  },
  scoreBadge: {
    background: "#e0e7ff",
    color: "#4f46e5",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "14px",
  },
  answersContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  answerBox: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  qNum: {
    display: "inline-block",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "2px 8px",
    borderRadius: "12px",
    marginBottom: "8px",
  },
  answerText: {
    margin: 0,
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
  },
  backBtn: {
    background: "rgba(255, 255, 255, 0.7)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#4f46e5",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
  }
};
