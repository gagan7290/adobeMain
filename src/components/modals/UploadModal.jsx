import { useState } from "react";
import { uploadFresh } from "../../lib/api.js";

export default function UploadModal({ open, onClose, onOpened }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  async function doUpload() {
    setErr("");
    setMsg("");
    if (!file) {
      setErr("Please choose a PDF.");
      return;
    }
    setBusy(true);
    try {
      const res = await uploadFresh(file);

      const blobUrl = URL.createObjectURL(file);
      sessionStorage.setItem("prism.lastFreshUrl", blobUrl);
      sessionStorage.setItem("prism.lastFreshName", file.name || "Document.pdf");

      const jobText = res.jobIds?.length ? ` Job: ${res.jobIds[0]}` : "";
      setMsg(`Uploaded${jobText}. You can start reading now.`);
      onOpened?.(res);

      setTimeout(() => {
        onClose?.();
      }, 450);
    } catch (e) {
      setErr(e?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ fontWeight: 700 }}>Upload a PDF</div>
          <button style={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          style={{ ...styles.btn, opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer" }}
          onClick={doUpload}
          disabled={busy}
        >
          {busy ? "Uploading…" : "Upload"}
        </button>

        {msg && <div style={{ marginTop: 10, color: "#9fe6b8" }}>{msg}</div>}
        {err && <div style={{ marginTop: 10, color: "#ff9a9a" }}>{err}</div>}

        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
          Max size is limited by the backend (<code>MAX_UPLOAD_MB</code>). Once processed,
          your document appears in Library and can be opened in Workspace. You can start reading
          immediately; indexing is done in the background.
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.45)",
    display: "grid",
    placeItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: 520,
    maxWidth: "92vw",
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.05)",
    backdropFilter: "blur(6px)",
    color: "#e8ecf3",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 18,
  },
  close: {
    background: "transparent",
    border: 0,
    color: "inherit",
    fontSize: 18,
    cursor: "pointer",
  },
  btn: {
    marginTop: 14,
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    background: "#6bb7ff",
    color: "#021126",
    fontWeight: 700,
    boxShadow: "0 6px 18px rgba(85,160,255,.35)",
  },
};
