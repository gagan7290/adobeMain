import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Workspace.module.css";
import PdfViewer from "../components/pdf/PdfViewer.jsx";
import { answerSmart, listVoices, buildAudioUrl } from "../lib/api.js";
import VoiceSelect from "../components/voiceControl/voiceControl.jsx";
function Chip({ active, onClick, children }) {
  return (
    <div
      className={`${styles.chip} ${active ? styles.chipActive : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function pickDefaultVoiceShortName(voices) {
  if (!Array.isArray(voices) || voices.length === 0) return "";
  const jenny = voices.find((v) =>
    (v.shortName || v.name || "").toLowerCase().includes("jenny")
  );
  return jenny?.shortName || voices[0]?.shortName || voices[0]?.name || "";
}

export default function Workspace() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState("Document.pdf");
  const [isOpening, setIsOpening] = useState(false);

  const [deep, setDeep] = useState(false);
  const [narrate, setNarrate] = useState(false);
  const [voices, setVoices] = useState([]); 
  const [voice, setVoice] = useState("");   
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  const pdfRef = useRef(null);

  useEffect(() => {
    const savedUrl = sessionStorage.getItem("prism.lastFreshUrl");
    const savedName = sessionStorage.getItem("prism.lastFreshName");
    if (savedUrl) {
      setPdfUrl(savedUrl);
      setPdfName(savedName || "Document.pdf");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await listVoices("en"); 
        const vs = Array.isArray(raw) ? raw : raw?.voices || [];
        if (cancelled) return;
        setVoices(vs);
        setVoice((prev) => prev || pickDefaultVoiceShortName(vs));
      } catch (err) {
        console.error("Failed to load voices:", err);
        if (!cancelled) {
          setVoices([]);
          setVoice("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleTextSelected(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const short = trimmed.length > 600 ? `${trimmed.slice(0, 600)}…` : trimmed;
    setQuery(short);
  }

  async function onAsk() {
    const q = query.trim();
    if (!q) return;

    setBusy(true);
    setAnswer("");
    setSources([]);
    setAudioUrl(null);

    try {
      const chosenVoice = narrate
        ? voice || pickDefaultVoiceShortName(voices) || undefined
        : undefined;

      const res = await answerSmart({
        query: q,
        k: 5,
        deep,
        tts: narrate,
        voice: chosenVoice,
      });

      setAnswer(res?.answer || "");
      setSources(Array.isArray(res?.sources) ? res.sources : []);
      setAudioUrl(buildAudioUrl(res?.audio?.url));
    } catch (e) {
      console.error(e);
      setAnswer(`⚠️ ${e?.message || "Failed to get answer."}`);
    } finally {
      setBusy(false);
    }
  }

  function openLocalPdf() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "application/pdf";
    inp.onchange = () => {
      const file = inp.files?.[0];
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      setPdfUrl(blobUrl);
      setPdfName(file.name || "Document.pdf");
      sessionStorage.setItem("prism.lastFreshUrl", blobUrl);
      sessionStorage.setItem("prism.lastFreshName", file.name || "Document.pdf");
    };
    inp.click();
  }

  const sourcesCards = useMemo(() => {
    return (sources || []).map((s, idx) => (
      <div
        key={`${s.docId}-${s.sectionId}-${idx}`}
        className={styles.card}
        onClick={() => {
          const p = Math.max(1, Number(s.page || 1));
          const y = typeof s.y === "number" ? s.y : 0;
          pdfRef.current?.goTo?.(p, y);
        }}
      >
        <div className={styles.mono} style={{ marginBottom: 6 }}>
          {s.docOrigName || s.docTitle || s.docId}
        </div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          {s.sectionTitle || s.sectionId}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>
          {s.snippet}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <span className={styles.badge}>p.{s.page || 1}</span>
          {typeof s.score === "number" && (
            <span className={styles.badge}>score {s.score.toFixed(2)}</span>
          )}
        </div>
      </div>
    ));
  }, [sources]);

  return (
    <div className={styles.wrap}>
      <div className={`${styles.panel} ${styles.left}`}>
        <div className={styles.headerRow}>
          <div>Workspace</div>
          <div className={styles.rowChips} style={{ gap: 10 }}>
            <button className={styles.chip} onClick={openLocalPdf}>
              Open PDF
            </button>
            {/* <div className={styles.mono} style={{ opacity: 0.6 }}>
              Tip: select text in the PDF → it auto-appears in “Ask”.
            </div> */}
            {isOpening && <div className={styles.badge}>Opening…</div>}
          </div>
        </div>

        <PdfViewer
          ref={pdfRef}
          url={pdfUrl}
          fileName={pdfName}
          onReady={() => {}}
          onOpeningChange={(v) => setIsOpening(v)}
          onTextSelected={handleTextSelected}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.panel}>
          <div className={styles.headerRow}>
            <div>Ask your document</div>
            <div className={styles.rowChips}>
              <Chip active={deep} onClick={() => setDeep((d) => !d)}>
                Deep
              </Chip>
              <Chip active={narrate} onClick={() => setNarrate((n) => !n)}>
                Narrate
              </Chip>

              {/* <select
                disabled={!narrate}
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                title="Voice"
                style={{ opacity: narrate ? 1 : 0.4 }}
              >
                {voices.length === 0 ? (
                  <option value="">Loading voices…</option>
                ) : (
                  voices.map((v) => {
                    const val = v.shortName || v.name;
                    const label = `${v.shortName || v.name} (${v.locale || "—"})`;
                    return (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    );
                  })
                )}
              </select> */}

              <VoiceSelect
                narrate={narrate}
                voice={voice}
                setVoice={setVoice}
                voices={voices}
              />
            </div>
          </div>

          <div className={styles.askBox}>
            <textarea
              className={styles.askArea}
              placeholder="Ask something about your doc… (Tip: copy a small selection from the PDF to ground the answer)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={styles.btn} onClick={onAsk} disabled={busy}>
              {busy ? "Thinking…" : "Ask"}
            </button>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.answer}`}>
          <div className={styles.headerRow} style={{ padding: 0, marginBottom: 8 }}>
            <div>Answer</div>
          </div>
          <div className={styles.defaultText} style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {answer || "Your answer will appear here."}
          </div>
        </div>

        <div className={`${styles.panel} ${styles.sources}`}>
          <div className={styles.headerRow} style={{ padding: 0, marginBottom: 8 }}>
            <div>Sources</div>
          </div>
          <div className={styles.cards}>
            {sourcesCards.length ? (
              sourcesCards
            ) : (
              <div className={styles.defaultText}>No sources yet.</div>
            )}
          </div>
        </div>

        <div className={`${styles.panel} ${styles.audio}`}>
          <div className={styles.headerRow} style={{ padding: 0, marginBottom: 8 }}>
            <div>Narration</div>
          </div>
          {audioUrl ? (
            <audio src={audioUrl} controls style={{ width: "100%" }} />
          ) : (
            <div className={styles.defaultText}>No audio yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
