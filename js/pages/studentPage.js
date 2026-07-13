import { Session } from "../ui/Session.js";
import { ResultService } from "../services/ResultService.js";
import { barChart } from "../utils/chart.js";

// show the navbar
const session = new Session();
session.nav();
const user = session.need("student");

const results = new ResultService();

// get my results, newest first
const list = results.byStudent(user.user).sort((a, b) => new Date(b.time) - new Date(a.time));

// stats
document.getElementById("average").textContent = results.average(user.user) + "%";
document.getElementById("doneCount").textContent = list.length;

// draw the grades graph (oldest to newest)
const chart = document.getElementById("chart");
const ordered = list.slice().reverse();
if (ordered.length === 0) {
     chart.innerHTML = `<p class="text-muted">אין נתונים.</p>`;
} else {
    const data = [];
    for (let i = 0; i < ordered.length; i++) {
         data.push({ label: ordered[i].examName, value: ordered[i].grade });
    }
    chart.innerHTML = barChart(data, 100, "%");
}

// show the exam history
const box = document.getElementById("historyList");
if (list.length === 0) {
    box.innerHTML = `<p class="text-muted">עדיין לא ביצעת מבחנים.</p>`;
} else {
	let html = "";
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const date = new Date(item.time).toLocaleString("he-IL");
        html += `
      <div class="exam-card">
        <div><h5>${item.examName}</h5><p>${date}</p></div>
        <strong>${item.points}/${item.count} (${item.grade}%)</strong>
      </div>
    `;
    }
   box.innerHTML = html;
}