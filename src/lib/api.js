// src/lib/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";
const TIMEOUT_MS = 60000;

function abortableFetch(url, options = {}, timeout = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(id));
}

async function asJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
}

async function get(path) {
  const res = await abortableFetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return asJson(res);
}

async function post(path, body) {
  const res = await abortableFetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) throw new Error(await res.text());
  return asJson(res);
}

async function postMultipart(path, formData) {
  const res = await abortableFetch(`${BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return asJson(res);
}

// ---- Uploads ---------------------------------------------------------------

/** Upload a single fresh PDF (dev/local flow). */
export async function uploadFresh(file) {
  if (!file) throw new Error("No file provided.");
  const fd = new FormData();
  fd.append("file", file);
  const data = await postMultipart("/upload/fresh", fd);

  // Normalize docIds so UI can always rely on it.
  let docIds = [];
  if (Array.isArray(data?.docIds) && data.docIds.length) {
    docIds = data.docIds.map(String);
  } else if (Array.isArray(data?.docs)) {
    docIds = data.docs.map(d => d?.docId).filter(Boolean).map(String);
  } else if (data?.docId) {
    docIds = [String(data.docId)];
  }

  if (docIds.length) {
    // Persist latest doc id for "This PDF only" filter.
    sessionStorage.setItem("prism.lastFreshDocId", docIds[0]);
  }

  return { ...data, docIds };
}

/** Upload multiple PDFs. Backend preferred: /upload/many */
export async function uploadMany(files) {
  const pdfs = Array.from(files).filter(
    f => f.type === "application/pdf" || /\.pdf$/i.test(f.name)
  );
  if (!pdfs.length) throw new Error("No PDF files provided.");

  try {
    const fd = new FormData();
    pdfs.forEach(f => fd.append("files", f, f.name));
    const data = await postMultipart("/upload/many", fd);
    const docIds = (Array.isArray(data?.docIds) ? data.docIds : [])
      .map(String)
      .filter(Boolean);
    if (docIds.length) sessionStorage.setItem("prism.lastFreshDocId", docIds[0]);
    return { ...data, docIds };
  } catch {
    // Fallback: sequential single uploads
    const all = [];
    for (const f of pdfs) {
      const res = await uploadFresh(f);
      all.push(...(res.docIds || []));
    }
    if (all.length) sessionStorage.setItem("prism.lastFreshDocId", all[0]);
    return { ok: true, docIds: all };
  }
}

/** Upload a .zip (if backend supports /upload/zip). */
export async function uploadZip(zipFile) {
  if (!zipFile) throw new Error("No zip provided.");
  const fd = new FormData();
  fd.append("file", zipFile);
  const data = await postMultipart("/upload/zip", fd);
  const docIds = (Array.isArray(data?.docIds) ? data.docIds : [])
    .map(String)
    .filter(Boolean);
  if (docIds.length) sessionStorage.setItem("prism.lastFreshDocId", docIds[0]);
  return { ...data, docIds };
}

// ---- Q/A & friends ---------------------------------------------------------

export async function answerSmart(payload) {
  if (!payload?.query || !payload.query.trim()) {
    throw new Error("Query is empty.");
  }
  return post("/answer/smart", payload);
}

/** Related sections for highlights & source chips. */
export async function related(payload) {
  // payload: { query, k?, deep?, docIds? }
  if (!payload?.query || !payload.query.trim()) {
    throw new Error("Query is empty.");
  }
  return post("/related", payload);
}

/** Insights bullets; respects docIds for "This PDF only". */
export async function getInsights(payload) {
  // payload: { query, k?, deep?, docIds? }
  if (!payload?.query || !payload.query.trim()) {
    throw new Error("Query is empty.");
  }
  return post("/insights", payload);
}

export async function listVoices(locale = "en") {
  const data = await get(`/tts/voices?locale=${encodeURIComponent(locale)}`);
  const arr = Array.isArray(data) ? data : (data?.voices ?? []);
  return arr;
}

export function buildAudioUrl(relativeUrl) {
  if (!relativeUrl) return null;
  try {
    return new URL(relativeUrl).toString();
  } catch {
    const trimmed = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`;
    const apiBase = new URL(BASE);
    return `${apiBase.origin}${trimmed}`;
  }
}
