import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

// handles exams and their questions
export class ExamService {
   constructor() {
    this.key = "exams";
  }

  // load all exams from storage
   getAll() {
     const saved = localStorage.getItem(this.key);
    if (!saved) {
       return [];
    }

    const list = JSON.parse(saved);
		const exams = [];
    for (let i = 0; i < list.length; i++) {
      const data = list[i];
      const exam = new Exam(data.name, data.info, data.group, data.minutes, data.owner);
      exam.id = data.id;
      exam.code = data.code;
      exam.date = data.date;

      // rebuild the questions
       const items = data.items || [];
      for (let j = 0; j < items.length; j++) {
        const q = items[j];
        const question = new Question(q.title, q.options, q.right, q.level);
       question.id = q.id;
        exam.items.push(question);
      }

      exams.push(exam);
     }
    return exams;
  }

  // save a new exam
  save(exam) {
    const list = this.getAll();
     list.push(exam);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  // update an exam that already exists
  update(exam) {
    const list = this.getAll();
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === exam.id) {
        list[i] = exam;
        localStorage.setItem(this.key, JSON.stringify(list));
        return;
      }
    }
   }

	// delete an exam
  remove(id) {
    const list = this.getAll();
   const kept = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== id) {
        kept.push(list[i]);
      }
    }
    localStorage.setItem(this.key, JSON.stringify(kept));
  }

  // find one exam by id
  get(id) {
    const list = this.getAll();
   for (let i = 0; i < list.length; i++) {
     if (list[i].id === id) {
        return list[i];
			}
    }
     return undefined;
  }

  // all exams of one teacher
  byTeacher(user) {
    const list = this.getAll();
    const result = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].owner === user) {
        result.push(list[i]);
      }
    }
    return result;
  }

   // search by name or code, and filter by category
  find(text, group = "") {
    const word = text.toLowerCase();
    const list = this.getAll();
    const result = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const matchText = item.name.toLowerCase().includes(word) || item.code.toLowerCase().includes(word);
      const matchGroup = group === "" || item.group === group;
      if (matchText && matchGroup) {
        result.push(item);
      }
    }
    return result;
  }

  // list of all categories (no repeats)
  groups() {
    const list = this.getAll();
    const result = [];
     for (let i = 0; i < list.length; i++) {
      const group = list[i].group;
      if (group && !result.includes(group)) {
        result.push(group);
      }
    }
    result.sort();
    return result;
  }
}