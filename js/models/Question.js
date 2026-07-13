import { makeId } from "../utils/id.js";

// question data
export class Question {
    constructor(title, options, right, level = "medium") {
        this.id = makeId();
        this.title = title;
        this.options = options;
         this.right = right;
         this.level = level; //easy/medium/hard
    }

   // check answer
	check(answer) {
        return answer === this.right;
    }
}
