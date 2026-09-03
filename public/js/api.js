/* ==========================================================================
   api.js — FIXED for public folder deployment
   ========================================================================== */

const API_BASE_URL = "/api/v1"; // <-- relative, works both locally and production

/* ---------------------------------- fetch wrapper ---------------------------------- */
class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details || null;
  }
}

async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include", // keeps your session cookie
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
    );
  }

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message =
      (payload &&
        (payload.message || (payload.error && payload.error.message))) ||
      `Request failed (${res.status})`;
    const details =
      (payload &&
        (payload.errors || (payload.error && payload.error.details))) ||
      null;
    throw new ApiError(message, res.status, details);
  }

  return payload;
}

const api = {
  get: (path) => apiRequest(path, { method: "GET" }),
  post: (path, body) => apiRequest(path, { method: "POST", body }),
  put: (path, body) => apiRequest(path, { method: "PUT", body }),
  patch: (path, body) => apiRequest(path, { method: "PATCH", body }),
  del: (path) => apiRequest(path, { method: "DELETE" }),
};

/* ---------------------------------- DOM helpers ---------------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}
function escapeHtml(str) {
  return String(str ?? "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("") || "U"
  );
}

/* ---------------------------------- Toasts ---------------------------------- */
function ensureToastStack() {
  let stack = qs(".toast-stack");
  if (!stack) {
    stack = el("div", {
      class: "toast-stack",
      role: "status",
      "aria-live": "polite",
    });
    document.body.appendChild(stack);
  }
  return stack;
}
const TOAST_ICONS = { success: "✓", error: "!", warning: "⚠", info: "ℹ" };
function showToast({ type = "info", title, message, duration = 4200 }) {
  const stack = ensureToastStack();
  const toast = el("div", { class: `toast ${type}` }, [
    el("span", { class: "t-ic" }, TOAST_ICONS[type] || TOAST_ICONS.info),
    el("div", { class: "t-body" }, [
      el("b", {}, title),
      message ? el("span", {}, message) : null,
    ]),
    el(
      "button",
      { class: "t-close", "aria-label": "Dismiss", onclick: () => dismiss() },
      "✕",
    ),
  ]);
  stack.appendChild(toast);
  let removed = false;
  function dismiss() {
    if (removed) return;
    removed = true;
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 220);
  }
  if (duration) setTimeout(dismiss, duration);
  return dismiss;
}
const toast = {
  success: (title, message) => showToast({ type: "success", title, message }),
  error: (title, message) => showToast({ type: "error", title, message }),
  warning: (title, message) => showToast({ type: "warning", title, message }),
  info: (title, message) => showToast({ type: "info", title, message }),
};

/** Friendly wrapper: run an async action, auto-toast on ApiError. Returns the result or undefined. */
async function withErrorToast(promise, fallbackTitle = "Something went wrong") {
  try {
    return await promise;
  } catch (err) {
    if (err instanceof ApiError) {
      toast.error(
        err.status === 0 ? "Connection problem" : fallbackTitle,
        err.message,
      );
    } else {
      toast.error(fallbackTitle, "An unexpected error occurred.");
      console.error(err);
    }
    return undefined;
  }
}

/* ---------------------------------- Theme ---------------------------------- */
const THEME_KEY = "aisre_theme";
function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  qsa(".theme-toggle .ti").forEach(
    (i) => (i.textContent = mode === "dark" ? "☀" : "☾"),
  );
}
function initTheme() {
  const saved =
    localStorage.getItem(THEME_KEY) ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(saved);
  qsa(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  });
}

/* ---------------------------------- Mobile sidebar ---------------------------------- */
function initSidebarToggle() {
  const sidebar = qs(".sidebar");
  const toggleBtn = qs(".menu-toggle");
  if (!sidebar || !toggleBtn) return;
  let scrim = qs(".sidebar-scrim");
  if (!scrim) {
    scrim = el("div", { class: "sidebar-scrim" });
    document.body.appendChild(scrim);
  }
  const open = () => {
    sidebar.classList.add("open");
    scrim.classList.add("open");
  };
  const close = () => {
    sidebar.classList.remove("open");
    scrim.classList.remove("open");
  };
  toggleBtn.addEventListener("click", () =>
    sidebar.classList.contains("open") ? close() : open(),
  );
  scrim.addEventListener("click", close);
  qsa(".sidebar-nav .nav-item").forEach((n) =>
    n.addEventListener("click", close),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebarToggle();
});
