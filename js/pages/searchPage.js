import { Session } from "../ui/Session.js";
import { ExamService } from "../services/ExamService.js";

// show the navbar
const session = new Session();
session.nav();
session.need("student");

const exams = new ExamService();

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const groupSelect = document.getElementById("categoryFilter");
const box = document.getElementById("searchResults");

// fill the category list
const groups = exams.groups();
for (let i = 0; i < groups.length; i++) {
     groupSelect.innerHTML += `<option>${groups[i]}</option>`;
}

// show the exams that match the search and category
function draw() {
    const text = searchInput.value.trim();
    const group = groupSelect.value;
    const list = exams.find(text, group);

    if (list.length === 0) {
        box.innerHTML = `<p class="text-muted">לא נמצאו מבחנים.</p>`;
        return;
    }

     let html = "";
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        html += `
      <div class="exam-card">
        <div>
          <h5>${item.name}</h5>
          <p>${item.group || "ללא קטגוריה"} · ${item.count()} שאלות</p>
          <span class="exam-code">${item.code}</span>
        </div>
        <a href="take-exam.html?id=${item.id}" class="btn btn-sm btn-success">בצע מבחן</a>
      </div>
    `;
    }
    box.innerHTML = html;
}

searchBtn.addEventListener("click", draw);
groupSelect.addEventListener("change", draw);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        draw();
    }
});

draw();