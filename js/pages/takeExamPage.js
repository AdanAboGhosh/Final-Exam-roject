import { Session } from "../ui/Session.js";
import { ExamService } from "../services/ExamService.js";
import { ResultService } from "../services/ResultService.js";
import { Result } from "../models/Result.js";

// show the navbar
const session = new Session();
session.nav();
const user = session.need("student");

const exams = new ExamService();
const results = new ResultService();

// get the exam from the url
const id = new URLSearchParams(location.search).get("id");
const exam = exams.get(id);

const title = document.getElementById("examTitle");
const box = document.getElementById("examArea");
const sendBtn = document.getElementById("submitBtn");
const resultBox = document.getElementById("resultArea");
const timerText = document.getElementById("timer");

let left = 0;      // seconds left
let timer;         // timer id
let sent = false;  // did we send already
let items = [];    // questions in a mixed order

// mix an array and return a new one
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
		const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// show all the questions
function draw() {
  let html = "";
	for (let index = 0; index < items.length; index++) {
    const item = items[index];

    // make a mixed order for the answers
    const order = [];
    for (let k = 0; k < item.options.length; k++) {
      order.push(k);
    }
    const mixed = shuffle(order);

    let answers = "";
    for (let k = 0; k < mixed.length; k++) {
      const opt = mixed[k];
      answers += `<label class="answer-label"><input type="radio" name="q-${index}" value="${opt}"> ${item.options[opt]}</label>`;
		}

    html += `
      <div class="question-box" data-question="${index}">
        <h5>${index + 1}. ${item.title}</h5>
        ${answers}
      </div>
    `;
  }
  box.innerHTML = html;
}

// update the timer text
function clock() {
  const minutes = Math.floor(left / 60);
 let seconds = left % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
	timerText.textContent = minutes + ":" + seconds;
}

// start the countdown
function start() {
  left = exam.minutes * 60;
  clock();
  timer = setInterval(() => {
     left--;
    clock();
    if (left <= 0) {
      submit();
    }
  }, 1000);
}

// disable the button and all the answers
function lockInputs() {
  sendBtn.disabled = true;
  const inputs = document.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].disabled = true;
  }
}

// check the answers and save the result
function submit() {
  if (sent) {
    return;
  }
 sent = true;
  clearInterval(timer);

  let points = 0;
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
   const selected = document.querySelector(`input[name="q-${index}"]:checked`);

    let value = -1;
    if (selected) {
      value = Number(selected.value);
    }
		if (item.check(value)) {
      points++;
    }

    // show the correct answer under the question
    const qBox = document.querySelector(`[data-question="${index}"]`);
    const note = document.createElement("p");
     if (value === item.right) {
      note.className = "answer-note correct";
       note.textContent = "תשובה נכונה";
    } else {
			note.className = "answer-note wrong";
      note.textContent = "התשובה הנכונה: " + item.options[item.right];
    }
    qBox.appendChild(note);
  }

  const result = new Result(exam.id, exam.name, user.user, points, items.length);
  const saved = results.save(result);

  // if already taken, block it
  if (!saved) {
		resultBox.innerHTML = `<div class="alert alert-warning">כבר ביצעת את המבחן הזה, לא ניתן לבצע אותו שוב.</div>`;
    lockInputs();
    return;
  }

  // show the grade
  resultBox.innerHTML = `
    <div class="result-card">
      <h3>${result.grade}%</h3>
      <p>${result.points} תשובות נכונות מתוך ${result.count}</p>
      <a href="student.html" class="btn btn-primary">חזרה לאזור האישי</a>
    </div>
  `;
  lockInputs();
  resultBox.scrollIntoView({ behavior: "smooth" });
}

// decide what to show when the page opens
if (exam && results.hasTaken(user.user, exam.id)) {
  title.textContent = exam.name;
  box.innerHTML = `<div class="alert alert-warning">כבר ביצעת את המבחן הזה, לא ניתן לבצע אותו שוב.</div>`;
  sendBtn.hidden = true;
} else if (!exam || exam.items.length === 0) {
  title.textContent = exam ? exam.name : "מבחן";
  box.innerHTML = `<div class="alert alert-warning">המבחן לא נמצא או שאין בו שאלות.</div>`;
  sendBtn.hidden = true;
} else {
  title.textContent = exam.name;
  items = shuffle(exam.items);
  draw();
  start();
}

sendBtn.addEventListener("click", submit);