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


export async function uploadFresh(file) {
  if (!file) throw new Error("No file provided.");
  const fd = new FormData();
  fd.append("file", file);
  const data = await postMultipart("/upload/fresh", fd);

  if (!Array.isArray(data.jobIds)) {
    if (data.jobId) data.jobIds = [data.jobId];
    else data.jobIds = [];
  }
  return data;
}

export async function getStatus(jobId) {
  if (!jobId) throw new Error("Missing jobId");
  return get(`/status/${encodeURIComponent(jobId)}`);
}

export async function answerSmart(payload) {
  if (!payload?.query || !payload.query.trim()) {
    throw new Error("Query is empty.");
  }
  return post("/answer/smart", payload);
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
