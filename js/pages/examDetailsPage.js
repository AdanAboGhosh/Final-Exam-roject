import { Session } from "../ui/Session.js";
import { ExamService } from "../services/ExamService.js";
import { ResultService } from "../services/ResultService.js";
import { Question } from "../models/Question.js";
import { barChart } from "../utils/chart.js";

// show the navbar
const session = new Session();
session.nav();
const user = session.need("teacher");
const exams = new ExamService();
const results = new ResultService();

// get the exam from the url
const id = new URLSearchParams(location.search).get("id");
let exam = exams.get(id);
// stop if the exam is missing or not mine
if (!exam || exam.owner !== user.user) {
    alert("המבחן לא נמצא.");
   location.href = "teacher.html";
}

// show the general info
function info() {
    const box = document.getElementById("examInfo");
    box.innerHTML = `
    <div class="info-grid">
      <p><b>ID:</b> ${exam.id}</p>
      <p><b>שם:</b> ${exam.name}</p>
      <p><b>קטגוריה:</b> ${exam.group || "ללא"}</p>
      <p><b>קוד:</b> <span class="exam-code">${exam.code}</span></p>
      <p><b>משך:</b> ${exam.minutes} דקות</p>
      <p><b>שאלות:</b> ${exam.count()}</p>
    </div>
    <p><b>תיאור:</b> ${exam.info || "ללא"}</p>
  `;
}


// show the questions list
function questions() {
    const box = document.getElementById("questionList");
	if (exam.items.length === 0) {
        box.innerHTML = `<p class="text-muted">עדיין אין שאלות.</p>`;
        return;
    }
    let html = "";
    for (let index = 0; index < exam.items.length; index++) {
        const item = exam.items[index];
        let opts = "";
        for (let i = 0; i < item.options.length; i++) {
            const rightClass = i === item.right ? "right-answer" : "";
            opts += `<li class="${rightClass}">${item.options[i]}</li>`;
        }
        html += `
      <div class="question-box">
        <div>
          <h6>${index + 1}. ${item.title} <span class="level">${item.level}</span></h6>
          <ol>${opts}</ol>
        </div>
        <button class="btn btn-sm btn-danger delete-question-btn" data-id="${item.id}">מחיקה</button>
      </div>
    `;
    }
     box.innerHTML = html;
}


// show the student scores
function scores() {
    const list = results.byExam(exam.id);
    const box = document.getElementById("resultsList");
    if (list.length === 0) {
        box.innerHTML = `<p class="text-muted">אין תוצאות עדיין.</p>`;
        return;
    }
   let html = "";
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        html += `<div class="exam-card"><span>${item.student}</span><strong>${item.points}/${item.count} (${item.grade}%)</strong></div>`;
    }
     box.innerHTML = html;
}



// show the average, number of students and the points graph
function dashboard() {
   const list = results.byExam(exam.id);
    // average grade
    let avg = 0;
     if (list.length > 0) {
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            sum += list[i].grade;
		}
        avg = Math.round(sum / list.length);
    }
    document.getElementById("examAvg").textContent = avg + "%";
    document.getElementById("examCount").textContent = list.length;
    const chart = document.getElementById("chart");
    if (list.length === 0) {
       chart.innerHTML = `<p class="text-muted">אין נתונים.</p>`;
        return;
    }



    // the top of the chart is the number of questions
	let max = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].count > max) {
            max = list[i].count;
        }
     }

     const data = [];
    for (let i = 0; i < list.length; i++) {
        data.push({ label: list[i].student, value: list[i].points });
    }
    chart.innerHTML = barChart(data, max);
}



// show a message near the add-question form
function show(text, type) {
     document.getElementById("questionMessage").innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}

// add a new question
document.getElementById("addQuestionBtn").addEventListener("click", () => {
    const title = document.getElementById("questionText").value.trim();

    // read the 4 answers
    const options = [];
    for (let n = 1; n <= 4; n++) {
        options.push(document.getElementById("answer" + n).value.trim());
    }
    const right = Number(document.getElementById("correctAnswer").value) - 1;
    const level = document.getElementById("difficulty").value;

    // check the inputs
    let empty = false;
   for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            empty = true;
        }
    }
     if (title === "" || empty) {
        show("יש למלא את השאלה וכל התשובות.", "danger");
         return;
    }
    if (right < 0 || right > 3) {
        show("יש לבחור תשובה נכונה בין 1 ל-4.", "danger");
        return;
   }

    exam.add(new Question(title, options, right, level));
    exams.update(exam);

     // clear the form
    document.getElementById("questionText").value = "";
    for (let n = 1; n <= 4; n++) {
        document.getElementById("answer" + n).value = "";
    }
    document.getElementById("correctAnswer").value = "";

    show("השאלה נוספה.", "success");
    info();
    questions();
});

// delete a question
document.getElementById("questionList").addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-question-btn")) {
		return;
    }
    exam.remove(e.target.dataset.id);
	exams.update(exam);
     info();
    questions();
});

// export the exam to a json file
document.getElementById("exportBtn").addEventListener("click", () => {
     const text = JSON.stringify(exam, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
   link.download = exam.name + ".json";
    link.click();
    URL.revokeObjectURL(url);
});

info();
questions();
scores();
dashboard();