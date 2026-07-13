import { Session } from "../ui/Session.js";
import { AuthService } from "../services/AuthService.js";

// show the navbar
const session = new Session();
session.nav();

const auth = new AuthService();

const userInput = document.getElementById("username");
const passInput = document.getElementById("password");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");

// show a message to the user
function show(text, type) {
 message.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// try to login when the button is clicked
loginBtn.addEventListener("click", () => {
  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (user === "" || pass === "") {
    show("יש להזין שם משתמש וסיסמה.", "danger");
    return;
  }

  const result = auth.login(user, pass);
  if (!result.ok) {
		show(result.text, "danger");
    return;
  }

  // go to the right page by role
  if (result.item.isTeacher()) {
    location.href = "teacher.html";
  } else {
    location.href = "student.html";
 }
});