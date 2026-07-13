import { makeId } from "../utils/id.js";

// exam data
export class Exam {
 constructor(name, info, group, minutes, owner) {
    this.id = makeId();
    this.name = name;
    this.info = info;
    this.group = group;
    this.code = Math.random().toString(36).slice(2, 8).toUpperCase();
     this.minutes = minutes;
    this.owner = owner;
    this.items = [];
    this.date = new Date().toISOString();
  }

  // add question
   add(item) {
		this.items.push(item);
  }

  // remove question
  remove(id) {
   this.items = this.items.filter(item => item.id !== id);
  }

  count() {
    return this.items.length;
 }
}
