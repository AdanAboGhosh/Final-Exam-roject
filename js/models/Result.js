import { makeId } from "../utils/id.js";

// exam result
export class Result {
    constructor(examId, examName, student, points, count) {
        this.id = makeId();
		this.examId = examId;
         this.examName = examName;
        this.student = student;
         this.points = points;
        this.count = count;
        // calculate grade
        this.grade = count ? Math.round((points / count) * 100) : 0;
        this.time = new Date().toISOString();
    }
}
