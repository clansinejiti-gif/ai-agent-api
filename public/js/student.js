/* ==========================================================================
   student.js — student dashboard: profile, book catalog, careers, AI engine
   ========================================================================== */

const state = {
  user: null,
  profile: null,
  books: [],
  careers: [],
  skills: [],
  genres: [],
};

/* ---------------------------------- boot ---------------------------------- */
(async function init() {
  const user = await requireAuth("student");
  if (!user) return;
  state.user = user;

  qs("#sb-name").textContent = user.fullName || user.email;
  qs("#sb-role").textContent = user.role;
  qs("#sb-avatar").textContent = initials(user.fullName || user.email);
  qs("#welcome-heading").textContent = `Welcome back, ${(user.fullName || user.email).split(" ")[0]}`;

  qs("#logout-btn").addEventListener("click", logout);
  initViewSwitching();
  wireProfileForm();
  wireBookFilters();
  wireCareerFilters();
  wireAiForm();

  loadProfile();
  loadBooks();
  loadCareers();
})();

/* ---------------------------------- view switching ---------------------------------- */
function initViewSwitching() {
  const titles = {
    overview: "Overview", profile: "My profile", books: "Book catalog",
    careers: "Career tracks", ai: "AI recommendations",
  };
  function goto(view) {
    qsa(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${view}`));
    qsa(".sidebar-nav .nav-item[data-view]").forEach((n) => n.classList.toggle("active", n.dataset.view === view));
    qs("#topbar-title").textContent = titles[view] || "Dashboard";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  qsa(".nav-item[data-view]").forEach((btn) => btn.addEventListener("click", () => goto(btn.dataset.view)));
  qsa("[data-goto]").forEach((btn) => btn.addEventListener("click", () => goto(btn.dataset.goto)));
}

/* ---------------------------------- overview stats ---------------------------------- */
function renderOverviewStats() {
  const container = qs("#overview-stats");
  const skillCount = state.profile?.skills?.length || 0;
  const completeness = profileCompleteness(state.profile);
  container.innerHTML = "";
  const stats = [
    ["◐", `${completeness}%`, "Profile complete"],
    ["▤", state.books.length || "0", "Books in catalog"],
    ["✺", state.careers.length || "0", "Career tracks available"],
  ];
  stats.forEach(([icon, value, label]) => {
    container.appendChild(el("div", { class: "card catalog-card stat-card" }, [
      el("div", { class: "stat-icon" }, icon),
      el("div", { class: "stat-value" }, String(value)),
      el("div", { class: "stat-label" }, label),
    ]));
  });
  qs("#profile-progress-fill").style.width = `${completeness}%`;
  qs("#profile-progress-label").textContent = completeness >= 100
    ? "Your profile is fully set up."
    : `${completeness}% complete — add ${skillCount === 0 ? "a few skills" : "more detail"} for sharper matches.`;
}
function profileCompleteness(p) {
  if (!p) return 0;
  const fields = [p.academicLevel, p.major, p.targetRole, p.learningStyle, p.skills?.length, p.preferredGenres?.length];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

/* ---------------------------------- profile ---------------------------------- */
async function loadProfile() {
  const res = await withErrorToast(api.get("/profiles/me"), "Couldn't load your profile");
  state.profile = res?.data || null;
  renderOverviewStats();
  renderProfileForm();
}

function renderProfileForm() {
  const skeleton = qs("#profile-form-skeleton");
  const form = qs("#profile-form");
  const p = state.profile || {};

  qs("#academicLevel").value = p.academicLevel || "Undergraduate";
  qs("#major").value = p.major || "";
  qs("#targetRole").value = p.targetRole || "";
  qs("#learningStyle").value = p.learningStyle || "Project-Based";

  state.skills = [...(p.skills || [])];
  state.genres = [...(p.preferredGenres || [])];
  renderTags("skills-wrap", state.skills, "skills-input");
  renderTags("genres-wrap", state.genres, "genres-input");

  skeleton.style.display = "none";
  form.style.display = "grid";
}

function renderTags(wrapId, list, inputId) {
  const wrap = qs(`#${wrapId}`);
  qsa(".tag-removable", wrap).forEach((t) => t.remove());
  const input = qs(`#${inputId}`);
  list.forEach((val, i) => {
    const tag = el("span", { class: "tag tag-removable" }, [
      document.createTextNode(val),
      el("button", { type: "button", "aria-label": `Remove ${val}`, onclick: () => { list.splice(i, 1); renderTags(wrapId, list, inputId); } }, "✕"),
    ]);
    wrap.insertBefore(tag, input);
  });
}

function wireTagInput(inputId, list, wrapId) {
  const input = qs(`#${inputId}`);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = input.value.trim().replace(/,$/, "");
      if (val && !list.includes(val)) {
        list.push(val);
        renderTags(wrapId, list, inputId);
      }
      input.value = "";
    } else if (e.key === "Backspace" && !input.value && list.length) {
      list.pop();
      renderTags(wrapId, list, inputId);
    }
  });
}

function wireProfileForm() {
  wireTagInput("skills-input", state.skills, "skills-wrap");
  wireTagInput("genres-input", state.genres, "genres-wrap");

  qs("#profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#profile-submit");
    setBtnLoading(btn, true);
    const payload = {
      academicLevel: qs("#academicLevel").value,
      major: qs("#major").value.trim(),
      targetRole: qs("#targetRole").value.trim(),
      skills: state.skills,
      preferredGenres: state.genres,
      learningStyle: qs("#learningStyle").value,
    };
    const res = await withErrorToast(api.put("/profiles/me", payload), "Couldn't save your profile");
    setBtnLoading(btn, false);
    if (res) {
      toast.success("Profile saved", "Your recommendations will use these details.");
      state.profile = { ...state.profile, ...payload };
      renderOverviewStats();
    }
  });
}

/* ---------------------------------- book catalog ---------------------------------- */
async function loadBooks() {
  const container = qs("#books-container");
  const res = await withErrorToast(api.get("/books"), "Couldn't load the catalog");
  if (!res) {
    renderError(container, "Couldn't load the catalog", "Check your connection and try again.", loadBooks);
    return;
  }
  state.books = res.data || [];
  populateFilterOptions();
  renderOverviewStats();
  renderBooks(state.books);
}

function populateFilterOptions() {
  const categories = [...new Set(state.books.map((b) => b.category).filter(Boolean))];
  const levels = [...new Set(state.books.map((b) => b.skillLevel).filter(Boolean))];
  fillSelect("#book-category-filter", categories, "All categories");
  fillSelect("#book-skill-filter", levels, "All levels");
}
function fillSelect(sel, values, placeholder) {
  const el = qs(sel);
  const current = el.value;
  el.innerHTML = `<option value="">${placeholder}</option>` + values.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("");
  el.value = current;
}

function renderBooks(books) {
  const container = qs("#books-container");
  container.className = "book-grid";
  container.innerHTML = "";
  if (!books.length) {
    renderEmpty(container, "▤", "No books match your filters", "Try a different search term or clear your filters.");
    return;
  }
  books.forEach((book) => {
    container.appendChild(el("div", { class: "card catalog-card card-hover book-card" }, [
      el("span", { class: "badge badge-violet book-cat" }, book.category || "General"),
      el("h4", {}, book.title || "Untitled"),
      el("div", { class: "book-author" }, book.author ? `by ${book.author}` : ""),
      el("div", { class: "book-tags" }, [
        book.skillLevel ? el("span", { class: "tag" }, book.skillLevel) : null,
        ...(book.tags || []).slice(0, 3).map((t) => el("span", { class: "tag" }, t)),
      ]),
      el("div", { class: "book-foot" }, [
        el("a", {
          class: "btn btn-primary btn-sm", style: "flex:1;",
          href: book.bookUrl || "#", target: book.bookUrl ? "_blank" : "_self", rel: "noopener noreferrer",
          onclick: (e) => { if (!book.bookUrl) { e.preventDefault(); toast.warning("No link available", "This title doesn't have a linked URL yet."); } },
        }, "Open book ↗"),
      ]),
    ]));
  });
}

function wireBookFilters() {
  const search = qs("#book-search");
  const catFilter = qs("#book-category-filter");
  const skillFilter = qs("#book-skill-filter");
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    const cat = catFilter.value;
    const lvl = skillFilter.value;
    const filtered = state.books.filter((b) => {
      const matchesQ = !q || (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q);
      const matchesCat = !cat || b.category === cat;
      const matchesLvl = !lvl || b.skillLevel === lvl;
      return matchesQ && matchesCat && matchesLvl;
    });
    renderBooks(filtered);
  };
  search.addEventListener("input", debounce(apply, 200));
  catFilter.addEventListener("change", apply);
  skillFilter.addEventListener("change", apply);
}

/* ---------------------------------- career tracks ---------------------------------- */
async function loadCareers(domain) {
  const container = qs("#careers-container");
  const query = domain ? `?domain=${encodeURIComponent(domain)}` : "";
  const res = await withErrorToast(api.get(`/careers/tracks${query}`), "Couldn't load career tracks");
  if (!res) {
    renderError(container, "Couldn't load career tracks", "Check your connection and try again.", () => loadCareers(domain));
    return;
  }
  state.careers = res.data || [];
  renderOverviewStats();
  renderCareers(state.careers);
}
function wireCareerFilters() {
  const input = qs("#career-domain-filter");
  const clearBtn = qs("#career-domain-clear");
  input.addEventListener("input", debounce(() => loadCareers(input.value.trim()), 350));
  clearBtn.addEventListener("click", () => { input.value = ""; loadCareers(); });
}
function renderCareers(tracks) {
  const container = qs("#careers-container");
  container.innerHTML = "";
  if (!tracks.length) {
    renderEmpty(container, "✺", "No matching career tracks", "Try a different domain, or clear the filter to see everything.");
    return;
  }
  const demandColor = { high: "badge-success", medium: "badge-warning", low: "badge-neutral" };
  tracks.forEach((t) => {
    container.appendChild(el("div", { class: "card catalog-card card-hover track-card" }, [
      el("div", { class: "track-head" }, [
        el("h4", {}, t.title || "Untitled track"),
        t.industryDemand ? el("span", { class: `badge ${demandColor[(t.industryDemand || "").toLowerCase()] || "badge-neutral"}` }, `${t.industryDemand} demand`) : null,
      ]),
      t.domain ? el("span", { class: "tag", style: "margin-bottom:4px;" }, t.domain) : null,
      el("p", { class: "text-muted", style: "font-size:13px; margin-top:8px;" }, "Key skills for this roadmap:"),
      el("div", { class: "track-skills" }, (t.keySkills || []).map((s) => el("span", { class: "tag" }, s))),
    ]));
  });
}

/* ---------------------------------- AI recommendations ---------------------------------- */
function wireAiForm() {
  qs("#ai-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#ai-submit");
    const resultBox = qs("#ai-result");
    const payload = {
      focusArea: qs("#focusArea").value.trim(),
      timeCommitmentHoursPerWeek: Number(qs("#timeCommitment").value),
      primaryGoal: qs("#primaryGoal").value.trim(),
    };
    setBtnLoading(btn, true);
    resultBox.innerHTML = "";
    resultBox.appendChild(el("div", {}, [
      el("div", { class: "skeleton sk-line", style: "width:60%" }),
      el("div", { class: "skeleton sk-line", style: "width:90%" }),
      el("div", { class: "skeleton", style: "height:120px; border-radius:12px; margin-top:14px;" }),
    ]));

    const res = await withErrorToast(api.post("/ai/recommendations", payload), "Couldn't generate recommendations");
    setBtnLoading(btn, false);
    if (!res) {
      renderEmpty(resultBox, "✦", "Something went wrong", "We couldn't generate recommendations. Please try again.");
      return;
    }
    if (res.data.limit) {
      renderEmpty(resultBox, "✦", "Daily limit reached. You can only create 2 recommendations per day. Try again tomorrow.");
      toast.success("Daily limit reached", "");
      return;
    }
    renderAiResult(res.data);
    toast.success("Recommendations ready", "Your personalized plan is in.");
  });
}

function renderAiResult(data) {
  const box = qs("#ai-result");
  box.innerHTML = "";
  box.appendChild(el("div", {}, [
    el("span", { class: "eyebrow" }, "Student summary"),
    el("h3", { class: "display-3", style: "margin:8px 0 16px;" }, `${data.studentSummary?.major || "—"} → ${data.studentSummary?.targetRole || "—"}`),
  ]));

  const booksWrap = el("div", { class: "reco-books" });
  (data.recommendedBooks || []).forEach((b) => {
    booksWrap.appendChild(el("div", { class: "card catalog-card card-pad", style: "padding:16px;" }, [
      el("h4", { style: "font-family:var(--font-display); font-size:1rem; margin-bottom:8px;" }, b.title),
      b.matchReason ? el("div", { class: "match-reason" }, b.matchReason) : null,
    ]));
  });
  if ((data.recommendedBooks || []).length) box.appendChild(booksWrap);

  if (data.careerAdvice) {
    box.appendChild(el("div", { class: "advice-card" }, [
      el("span", { class: "eyebrow" }, `Roadmap · ${data.careerAdvice.focusArea || ""}`),
      el("p", {}, data.careerAdvice.roadmapStep || ""),
    ]));
  }
}

/* ---------------------------------- shared render helpers ---------------------------------- */
function renderEmpty(container, icon, title, message) {
  container.className = "";
  container.innerHTML = "";
  container.appendChild(el("div", { class: "empty-state" }, [
    el("div", { class: "es-icon" }, icon),
    el("h4", {}, title),
    el("p", {}, message),
  ]));
}
function renderError(container, title, message, retryFn) {
  container.className = "";
  container.innerHTML = "";
  const retry = el("button", { class: "btn btn-ghost btn-sm", onclick: retryFn }, "Try again");
  container.appendChild(el("div", { class: "error-state" }, [
    el("div", { class: "es-icon" }, "!"),
    el("h4", {}, title),
    el("p", {}, message),
    retry,
  ]));
}
