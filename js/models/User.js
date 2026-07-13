import { makeId } from "../utils/id.js";

// user data
export class User {
   constructor(name, user, pass, type) {
		this.id = makeId();
      this.name = name;
      this.user = user;
      this.pass = pass;
      this.type = type;
   }

   // check user role (teacher or student)
   isTeacher() {
       return this.type === "teacher";
   }

   isStudent() {
      return this.type === "student";
   }
}
