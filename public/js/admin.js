/* ==========================================================================
   admin.js — admin dashboard: overview, manage books/tracks, students, analytics

   Note on the Students view: the provided API surface has no "list all
   students" endpoint. This UI calls GET /auth/users as the most likely
   home for that data and degrades to a clear, actionable empty state if
   the backend doesn't expose it yet — see loadStudents() below.
   ========================================================================== */

const state = { books: [], tracks: [], students: [], studentsAvailable: true };

(async function init() {
  const user = await requireAuth("admin");
  if (!user) return;

  qs("#sb-name").textContent = user.fullName || user.email;
  qs("#sb-role").textContent = user.role;
  qs("#sb-avatar").textContent = initials(user.fullName || user.email);
  qs("#welcome-heading").textContent = `Welcome back, ${(user.fullName || user.email).split(" ")[0]}`;

  qs("#logout-btn").addEventListener("click", logout);
  initViewSwitching();
  wireModals();
  wireBookForm();
  wireTrackForm();

  await Promise.all([loadBooks(), loadTracks(), loadStudents()]);
  renderStats();
  renderAnalytics();
  renderRecentActivity();
})();

/* ---------------------------------- view switching ---------------------------------- */
function initViewSwitching() {
  const titles = { overview: "Overview", books: "Manage books", careers: "Career tracks", students: "Students", analytics: "Analytics" };
  function goto(view) {
    qsa(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${view}`));
    qsa(".sidebar-nav .nav-item[data-view]").forEach((n) => n.classList.toggle("active", n.dataset.view === view));
    qs("#topbar-title").textContent = titles[view] || "Dashboard";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  qsa(".nav-item[data-view]").forEach((btn) => btn.addEventListener("click", () => goto(btn.dataset.view)));
}

/* ---------------------------------- modals ---------------------------------- */
function wireModals() {
  qs("#add-book-btn").addEventListener("click", () => openModal("book-modal"));
  qs("#add-track-btn").addEventListener("click", () => openModal("track-modal"));
  qsa("[data-close-modal]").forEach((btn) => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
  qsa(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(overlay.id); });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") qsa(".modal-overlay.open").forEach((o) => closeModal(o.id));
  });
}
function openModal(id) { qs(`#${id}`).classList.add("open"); }
function closeModal(id) { qs(`#${id}`).classList.remove("open"); qs(`#${id} form`)?.reset(); }

/* ---------------------------------- overview stats ---------------------------------- */
function renderStats() {
  const container = qs("#admin-stats");
  container.innerHTML = "";
  const stats = [
    ["◐", state.studentsAvailable ? state.students.length : "—", "Total students"],
    ["▤", state.books.length, "Total books"],
    ["✺", state.tracks.length, "Career tracks"],
    ["⌗", state.books.length + state.tracks.length, "Catalog items"],
  ];
  stats.forEach(([icon, value, label]) => {
    container.appendChild(el("div", { class: "card catalog-card stat-card" }, [
      el("div", { class: "stat-icon" }, icon),
      el("div", { class: "stat-value" }, String(value)),
      el("div", { class: "stat-label" }, label),
    ]));
  });
}

function renderRecentActivity() {
  const list = qs("#recent-activity");
  list.innerHTML = "";
  const items = [
    ...state.books.slice(-3).reverse().map((b) => ({ icon: "▤", text: `"${b.title}" is available in the catalog`, tone: "badge-violet" })),
    ...state.tracks.slice(-2).reverse().map((t) => ({ icon: "✺", text: `Career track "${t.title}" is live`, tone: "badge-success" })),
  ];
  if (!items.length) {
    list.appendChild(el("li", { class: "text-muted", style: "font-size:13.5px;" }, "No recent activity yet — add a book or career track to get started."));
    return;
  }
  items.forEach((it) => {
    list.appendChild(el("li", { style: "display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-c);" }, [
      el("span", { class: `badge ${it.tone}`, style: "width:28px; height:28px; border-radius:50%; padding:0; display:flex; align-items:center; justify-content:center;" }, it.icon),
      el("span", { style: "font-size:13.5px;" }, it.text),
    ]));
  });
  list.lastChild.style.borderBottom = "none";
}

/* ---------------------------------- books ---------------------------------- */
async function loadBooks() {
  const res = await withErrorToast(api.get("/books"), "Couldn't load books");
  state.books = res?.data || [];
  renderBooksTable();
}
function renderBooksTable() {
  const tbody = qs("#books-table-body");
  tbody.innerHTML = "";
  if (!state.books.length) {
    tbody.appendChild(el("tr", {}, el("td", { colspan: "5" },
      renderInlineEmpty("No books yet", "Add your first catalog title to get started.")
    )));
    return;
  }
  state.books.forEach((b) => {
    tbody.appendChild(el("tr", {}, [
      el("td", { style: "font-weight:600;" }, b.title || "—"),
      el("td", {}, b.author || "—"),
      el("td", {}, el("span", { class: "badge badge-violet" }, b.category || "—")),
      el("td", {}, b.skillLevel || "—"),
      el("td", {}, (b.tags || []).slice(0, 3).map((t) => el("span", { class: "tag", style: "margin-right:5px;" }, t))),
    ]));
  });
}
function wireBookForm() {
  qs("#book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#book-submit");
    const payload = {
      title: qs("#b-title").value.trim(),
      author: qs("#b-author").value.trim(),
      category: qs("#b-category").value.trim(),
      skillLevel: qs("#b-level").value,
      bookUrl: qs("#b-url").value.trim() || undefined,
      tags: qs("#b-tags").value.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setBtnLoading(btn, true);
    const res = await withErrorToast(api.post("/books", payload), "Couldn't add the book");
    setBtnLoading(btn, false);
    if (res) {
      toast.success("Book added", `"${payload.title}" is now in the catalog.`);
      closeModal("book-modal");
      await loadBooks();
      renderStats();
      renderAnalytics();
      renderRecentActivity();
    }
  });
}

/* ---------------------------------- career tracks ---------------------------------- */
async function loadTracks() {
  const res = await withErrorToast(api.get("/careers/tracks"), "Couldn't load career tracks");
  state.tracks = res?.data || [];
  renderTracksTable();
}
function renderTracksTable() {
  const tbody = qs("#tracks-table-body");
  tbody.innerHTML = "";
  if (!state.tracks.length) {
    tbody.appendChild(el("tr", {}, el("td", { colspan: "4" },
      renderInlineEmpty("No career tracks yet", "Add a roadmap so students have something to follow.")
    )));
    return;
  }
  const demandColor = { high: "badge-success", medium: "badge-warning", low: "badge-neutral" };
  state.tracks.forEach((t) => {
    tbody.appendChild(el("tr", {}, [
      el("td", { }, t.trackId || "—"),
      el("td", { style: "font-weight:600;" }, t.title || "—"),
      el("td", {}, (t.keySkills || []).slice(0, 4).map((s) => el("span", { class: "tag", style: "margin-right:5px;" }, s))),
      el("td", {}, el("span", { class: `badge ${demandColor[t.industryDemand] || "badge-neutral"}` }, t.industryDemand || "—")),
    ]));
  });
}
function wireTrackForm() {
  qs("#track-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#track-submit");
    const payload = {
      trackId: qs("#t-trackId").value.trim(),
      title: qs("#t-title").value.trim(),
      domain: qs("#t-domain").value.trim() || undefined,
      keySkills: qs("#t-skills").value.split(",").map((s) => s.trim()).filter(Boolean),
      industryDemand: qs("#t-demand").value,
    };
    setBtnLoading(btn, true);
    const res = await withErrorToast(api.post("/careers/tracks", payload), "Couldn't add the career track");
    setBtnLoading(btn, false);
    if (res) {
      toast.success("Track added", `"${payload.title}" is now live for students.`);
      closeModal("track-modal");
      await loadTracks();
      renderStats();
      renderAnalytics();
      renderRecentActivity();
    }
  });
}

/* ---------------------------------- students ---------------------------------- */
async function loadStudents() {
  const tbody = qs("#students-table-body");
  try {
    const res = await api.get("/auth/users");
    state.students = (res?.data || []).filter((u) => u.role === "student" || !u.role);
    state.studentsAvailable = true;
    renderStudentsTable();
  } catch (err) {
    state.studentsAvailable = false;
    tbody.innerHTML = "";
    tbody.appendChild(el("tr", {}, el("td", { colspan: "4" },
      renderInlineEmpty(
        "Student directory isn't available yet",
        "This dashboard expects a GET /api/v1/auth/users endpoint to list registered students — add it on the backend to populate this view."
      )
    )));
  }
}
function renderStudentsTable() {
  const tbody = qs("#students-table-body");
  tbody.innerHTML = "";
  if (!state.students.length) {
    tbody.appendChild(el("tr", {}, el("td", { colspan: "4" }, renderInlineEmpty("No students yet", "Registered students will appear here."))));
    return;
  }
  state.students.forEach((s) => {
    tbody.appendChild(el("tr", {}, [
      el("td", { style: "font-weight:600;" }, s.fullName || "—"),
      el("td", {}, s.email || "—"),
      el("td", {}, s.targetRole || "—"),
      el("td", {}, s.major || "—"),
    ]));
  });
}

/* ---------------------------------- analytics ---------------------------------- */
function renderAnalytics() {
  renderBarChart("#chart-category", groupCount(state.books, "category"));
  renderBarChart("#chart-skill", groupCount(state.books, "skillLevel"));
}
function groupCount(list, key) {
  const counts = {};
  list.forEach((item) => {
    const k = item[key] || "Unspecified";
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}
function renderBarChart(sel, counts) {
  const container = qs(sel);
  container.innerHTML = "";
  const entries = Object.entries(counts);
  if (!entries.length) {
    container.appendChild(renderInlineEmpty("No data yet", "Add books to see this breakdown."));
    return;
  }
  const max = Math.max(...entries.map(([, v]) => v));
  entries.forEach(([label, value]) => {
    container.appendChild(el("div", { class: "bar-row" }, [
      el("span", { class: "bar-label" }, label),
      el("div", { class: "progress-bar", style: "flex:1;" }, el("span", { style: `width:${(value / max) * 100}%` })),
      el("span", { class: "bar-value" }, String(value)),
    ]));
  });
}

/* ---------------------------------- helpers ---------------------------------- */
function renderInlineEmpty(title, message) {
  return el("div", { style: "padding:18px 4px; text-align:center;" }, [
    el("div", { style: "font-weight:600; font-size:13.5px; margin-bottom:4px;" }, title),
    el("div", { class: "text-muted", style: "font-size:12.5px; max-width:44ch; margin:0 auto;" }, message),
  ]);
}
