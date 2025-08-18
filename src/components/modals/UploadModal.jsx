import { useState } from "react";
import { uploadFresh } from "../../lib/api.js";
import styles from "./UploadModal.module.css";
import FileUpload from "../svgicons/fileUploadIcon.jsx";
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
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {/* <div className={styles.title}>Upload a PDF</div> */}
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

      <div className={styles.uploadContainer}>
        <label className={styles.fileUpload}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <FileUpload dim={42}/>
            <div className={styles.uploadText}><span className={styles.largerSuggestion}>Drag and drop <span className={styles.highlightText}>Pdf file</span> here</span> <div>or <span className={styles.highlightText} style={{textDecoration: "underline"}}>Browse file</span> on your computer</div></div>
          </label>

      </div>


      {file && (
          <div className={styles.fileName}>
            {file.name}
          </div>
        )}
        <button
          className={styles.btn}
          style={{ opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer" }}
          onClick={doUpload}
          disabled={busy}
        >
          {busy ? "Uploading…" : "Upload"}
        </button>

        {msg && <div className={styles.success}>{msg}</div>}
        {err && <div className={styles.error}>{err}</div>}

        {/* <div className={styles.hint}>
          Max size is limited by the backend (<code>MAX_UPLOAD_MB</code>). Once processed,
          your document appears in Library and can be opened in Workspace. You can start reading
          immediately; indexing is done in the background.
        </div> */}
      </div>
    </div>
  );
}
