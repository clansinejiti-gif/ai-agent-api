/* ==========================================================================
   auth.js — session guard (used by every protected page) + login/register
   ========================================================================== */

/** Fetch the current session user, or null if not authenticated. */
async function getCurrentUser() {
  try {
    const res = await api.get("/auth/me");
    return res?.data || null;
  } catch {
    return null;
  }
}

/**
 * Protect a page: redirects to login if not authenticated, or to the
 * correct dashboard if the role doesn't match. Returns the user object.
 */
async function requireAuth(role) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  if (role && user.role !== role) {
    window.location.href = user.role === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
    return null;
  }
  return user;
}

/** For login/register pages: bounce an already-authenticated user to their dashboard. */
async function redirectIfAuthed() {
  const user = await getCurrentUser();
  if (user) {
    window.location.href = user.role === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
  }
}

async function logout() {
  await withErrorToast(api.post("/auth/logout"), "Couldn't sign out");
  window.location.href = "login.html";
}

function setBtnLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle("is-loading", loading);
  btn.disabled = loading;
}

function wirePasswordToggle(root = document) {
  qsa(".pw-toggle button", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".pw-toggle").querySelector("input");
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
    });
  });
}

function setFieldError(fieldEl, message) {
  const errEl = fieldEl.querySelector(".field-error");
  const input = fieldEl.querySelector(".input");
  if (errEl) errEl.textContent = message || "";
  if (input) input.classList.toggle("input-error", !!message);
}

/* ---------------------------------- Login page ---------------------------------- */
function initLoginPage() {
  redirectIfAuthed();
  wirePasswordToggle();
  const form = qs("#login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailField = qs("#field-email");
    const pwField = qs("#field-password");
    setFieldError(emailField, "");
    setFieldError(pwField, "");

    const email = qs("#email").value.trim();
    const password = qs("#password").value;

    if (!email) return setFieldError(emailField, "Enter your email address.");
    if (!password) return setFieldError(pwField, "Enter your password.");

    const btn = qs("#login-submit");
    setBtnLoading(btn, true);
    try {
      const res = await api.post("/auth/login", { email, password });
      toast.success("Welcome back", res?.message || "Signed in successfully.");
      const role = res?.data?.role;
      setTimeout(() => {
        window.location.href = role === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
      }, 500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFieldError(pwField, "Incorrect email or password.");
      } else {
        toast.error("Sign-in failed", err.message || "Please try again.");
      }
    } finally {
      setBtnLoading(btn, false);
    }
  });
}

/* ---------------------------------- Register page ---------------------------------- */
function initRegisterPage() {
  redirectIfAuthed();
  wirePasswordToggle();
  const form = qs("#register-form");
  if (!form) return;

  const pwInput = qs("#password");
  const meterFill = qs("#pw-meter-fill");
  const meterLabel = qs("#pw-meter-label");
  if (pwInput) {
    pwInput.addEventListener("input", () => {
      const { score, label } = passwordStrength(pwInput.value);
      meterFill.style.width = `${(score / 4) * 100}%`;
      meterFill.style.background = ["#C0334D", "#C0334D", "#9A6B08", "#1F7A5C", "#1F7A5C"][score];
      meterLabel.textContent = pwInput.value ? label : "";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fields = {
      fullName: qs("#field-fullName"),
      email: qs("#field-email"),
      password: qs("#field-password"),
    };
    Object.values(fields).forEach((f) => setFieldError(f, ""));

    const fullName = qs("#fullName").value.trim();
    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    const agree = qs("#agree").checked;

    let hasError = false;
    if (fullName.length < 2) { setFieldError(fields.fullName, "Enter your full name."); hasError = true; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setFieldError(fields.email, "Enter a valid email address."); hasError = true; }
    if (password.length < 8) { setFieldError(fields.password, "Use at least 8 characters."); hasError = true; }
    if (!agree) { toast.warning("One more thing", "Please accept the terms to continue."); hasError = true; }
    if (hasError) return;

    const btn = qs("#register-submit");
    setBtnLoading(btn, true);
    try {
      // role is always forced to "student" — the UI never exposes admin signup
      const res = await api.post("/auth/register", { fullName, email, password, role: "student" });
      toast.success("Account created", res?.message || "Welcome to the platform!");
      setTimeout(async () => {
        try {
          await api.post("/auth/login", { email, password });
          window.location.href = "student-dashboard.html";
        } catch {
          window.location.href = "login.html";
        }
      }, 600);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFieldError(fields.email, "An account with this email already exists.");
      } else {
        toast.error("Registration failed", err.message || "Please try again.");
      }
    } finally {
      setBtnLoading(btn, false);
    }
  });
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}
