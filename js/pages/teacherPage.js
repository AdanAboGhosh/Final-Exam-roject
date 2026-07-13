import { Session } from "../ui/Session.js";
import { ExamService } from "../services/ExamService.js";
import { ResultService } from "../services/ResultService.js";
import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";
import { barChart } from "../utils/chart.js";

// show the navbar
const session = new Session();
session.nav();
const user = session.need("teacher");

const exams = new ExamService();
const results = new ResultService();
const listBox = document.getElementById("examList");
const message = document.getElementById("createMessage");

// show a message near the create form
function show(text, type) {
   message.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// average grade of one exam
function examAvg(id) {
	const list = results.byExam(id);
    if (list.length === 0) {
        return 0;
     }
    let sum = 0;
    for (let i = 0; i < list.length; i++) {
        sum += list[i].grade;
    }
     return Math.round(sum / list.length);
}

// show the exam count and the average graph
function stats() {
    const mine = exams.byTeacher(user.user);
    document.getElementById("totalExams").textContent = mine.length;
    const chart = document.getElementById("chart");
    if (mine.length === 0) {
        chart.innerHTML = `<p class="text-muted">אין מבחנים.</p>`;
        return;
    }
    const data = [];
    for (let i = 0; i < mine.length; i++) {
         data.push({ label: mine[i].name, value: examAvg(mine[i].id) });
    }
    chart.innerHTML = barChart(data, 100, "%");
}

// show my exams
function draw() {
    const list = exams.byTeacher(user.user);

    if (list.length === 0) {
        listBox.innerHTML = `<p class="text-muted">עדיין לא יצרת מבחנים.</p>`;
    } else {
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
          <div class="card-actions">
            <a href="exam-details.html?id=${item.id}" class="btn btn-sm btn-primary">ניהול</a>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">מחיקה</button>
          </div>
        </div>
      `;
		}
         listBox.innerHTML = html;
    }

	stats();
}

// create a new exam
document.getElementById("createExamBtn").addEventListener("click", () => {
    const name = document.getElementById("examTitle").value.trim();
    const info = document.getElementById("examDescription").value.trim();
    const group = document.getElementById("examCategory").value.trim();
    const minutes = Number(document.getElementById("examDuration").value);

    if (name === "") {
        show("יש להזין שם מבחן.", "danger");
		return;
    }
    if (minutes < 1) {
        show(" הזמן חייב להיות לפחות דקה.", "danger");
         return;
    }

	exams.save(new Exam(name, info, group, minutes, user.user));
    show("המבחן נוצר בהצלחה.", "success"); 
   document.getElementById("examTitle").value = "";
    document.getElementById("examDescription").value = "";
    document.getElementById("examCategory").value = "";
    draw();
});

// delete an exam
listBox.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-btn")) {
        return;
    }
     if (confirm("למחוק את המבחן?")) {
        exams.remove(e.target.dataset.id);
        draw();
    }
});

// import an exam from a json file
document.getElementById("importFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

	const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            const exam = new Exam(data.name, data.info, data.group, data.minutes, user.user);
            const items = data.items || [];
            for (let i = 0; i < items.length; i++) {
                const q = items[i];
                exam.add(new Question(q.title, q.options, q.right, q.level));
           }
            exams.save(exam);
            show("המבחן יובא בהצלחה.", "success");
             draw();
        } catch (err) {
            show("קובץ לא תקין.", "danger");
        }
    };
   reader.readAsText(file);
});

draw();