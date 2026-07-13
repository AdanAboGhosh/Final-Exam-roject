import { Result } from "../models/Result.js";

// handles the exam results
export class ResultService {
    constructor() {
       this.key = "results";
    }

    // load all results from storage
    getAll() {
        const saved = localStorage.getItem(this.key);
        if (!saved) {
            return [];
        }

        const list = JSON.parse(saved);
        const results = [];
        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            const result = new Result(data.examId, data.examName, data.student, data.points, data.count);
            result.id = data.id;
            result.grade = data.grade;
            result.time = data.time;
            results.push(result);
        }
        return results;
    }

    // save one result, but not if the student already took this exam
    save(item) {
        if (this.hasTaken(item.student, item.examId)) {
            return false;
        }

        const list = this.getAll();
        list.push(item);
        localStorage.setItem(this.key, JSON.stringify(list));
		return true;
    }

    // did this student already take this exam?
    hasTaken(user, examId) {
        const list = this.getAll();
         for (let i = 0; i < list.length; i++) {
             if (list[i].student === user && list[i].examId === examId) {
                return true;
            }
         }
        return false;
    }

    // all results of one student
    byStudent(user) {
        const list = this.getAll();
        const result = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].student === user) {
                result.push(list[i]);
            }
        }
        return result;
     }

    // all results of one exam
    byExam(id) {
        const list = this.getAll();
        const result = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].examId === id) {
                result.push(list[i]);
            }
        }
        return result;
    }

    // average grade of one student
    average(user) {
        const list = this.byStudent(user);
		if (list.length === 0) {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < list.length; i++) {
            sum += list[i].grade;
         }
        return Math.round(sum / list.length);
    }
}