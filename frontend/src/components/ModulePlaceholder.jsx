import { Construction } from "lucide-react";

function ModulePlaceholder({ title, description }) {
  return (
    <div style={{
      padding: "40px",
      minHeight: "70vh"
    }}>

      <div style={{
        background: "var(--card-bg, #ffffff)",
        border: "1px solid var(--border-color, #e8edf5)",
        borderRadius: "18px",
        padding: "45px",
        textAlign: "center"
      }}>

        <Construction
          size={55}
          color="#2563eb"
          style={{ marginBottom: "20px" }}
        />

        <h2 style={{ marginBottom: "12px" }}>
          {title}
        </h2>

        <p style={{ color: "#94a3b8" }}>
          {description}
        </p>

        <p style={{
          marginTop: "20px",
          color: "#2563eb",
          fontWeight: "600"
        }}>
          This module will be connected to the Spring Boot backend.
        </p>

      </div>

    </div>
  );
}

export default ModulePlaceholder;