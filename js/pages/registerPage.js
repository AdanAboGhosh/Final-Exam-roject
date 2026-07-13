import { Session } from "../ui/Session.js";
import { AuthService } from "../services/AuthService.js";

// show the navbar
const session = new Session();
session.nav();

const auth = new AuthService();

// get the inputs
const nameInput = document.getElementById("fullName");
const userInput = document.getElementById("username");
const passInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");

// show a message to the user
function show(text, type) {
   message.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// create the account when the button is clicked
registerBtn.addEventListener("click", () => {
	const name = nameInput.value.trim();
   const user = userInput.value.trim();
   const pass = passInput.value.trim();
    const type = roleInput.value;

   // check the inputs
   if (name === "" || user === "" || type === "") {
      show("יש למלא את כל השדות.", "danger");
      return;
   }
   if (pass.length < 5) {
      show("הסיסמה חייבת להכיל לפחות 5 תווים.", "danger");
      return;
   }

    // try to register
   const result = auth.register(name, user, pass, type);
   if (!result.ok) {
      show(result.text, "danger");
      return;
   }

   // ok, go to login
   show(result.text, "success");
   setTimeout(() => {
      location.href = "login.html";
   }, 700);
});