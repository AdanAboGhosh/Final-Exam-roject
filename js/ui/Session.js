import { AuthService } from "../services/AuthService.js";

// manage page session
export class Session {
  constructor() {
    this.auth = new AuthService();
  }

   // build navbar
  nav() {
    const box = document.getElementById("navbar");
    if (!box) return;

    const user = this.auth.current();
    // logo goes to my area, or home if not logged in
    const homeLink = user ? (user.isTeacher() ? "teacher.html" : "student.html") : "index.html";
    const links = user ? `
      <span class="user-text">שלום, ${user.name}</span>
      <a class="btn btn-sm btn-light" href="${user.isTeacher() ? "teacher.html" : "student.html"}">האזור שלי</a>
      <button id="logoutBtn" class="btn btn-sm btn-outline-light">התנתקות</button>
    ` : `
      <a class="btn btn-sm btn-light" href="login.html">התחברות</a>
      <a class="btn btn-sm btn-outline-light" href="register.html">הרשמה</a>
    `;

    box.innerHTML = `
      <nav class="topbar">
        <a class="brand" href="${homeLink}">מערכת מבחנים</a>
        <div class="nav-actions">
          <button id="themeBtn" class="theme-btn" title="Dark mode">🌙</button>
          ${links}
        </div>
      </nav>
    `;

   this.setTheme();
    document.getElementById("themeBtn").addEventListener("click", () => this.toggleTheme());
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      this.auth.logout();
       location.href = "index.html";
    });
  }

  setTheme() {
    const dark = localStorage.getItem("theme") === "dark";
    document.body.classList.toggle("dark", dark);
    const btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = dark ? "☀️" : "🌙"; //dark mode emojis
  }

  // switch theme
  toggleTheme() {
		const dark = !document.body.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    this.setTheme();
  }

  // protect page
   need(type = "") {
     const user = this.auth.current();
    if (!user) {
      alert("יש להתחבר כדי להיכנס לדף.");
      location.href = "login.html";
      return null;
    }
    if (type && user.type !== type) {
      alert("אין הרשאה לדף זה.");
     location.href = "index.html";
			return null;
    }
    return user;
	}
}
