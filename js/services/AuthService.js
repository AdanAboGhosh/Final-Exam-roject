import { User } from "../models/User.js";

// handles users, register and login
export class AuthService {
    constructor() {
        this.key = "users";
        this.loginKey = "currentUser";
    }

    // load all users from storage
    getUsers() {
        const saved = localStorage.getItem(this.key);
         if (!saved) {
             return [];
        }

		const list = JSON.parse(saved);
        const users = [];
        for (let i = 0; i < list.length; i++) {
            const data = list[i];
           const user = new User(data.name, data.user, data.pass, data.type);
            user.id = data.id;
            users.push(user);
        }
        return users;
    }

    // add a new user
    register(name, user, pass, type) {
        const users = this.getUsers();

        // stop if the username is taken
        for (let i = 0; i < users.length; i++) {
            if (users[i].user === user) {
                return { ok: false, text: "שם המשתמש קיים במערכת." };
            }
        }

       const newUser = new User(name, user, pass, type);
       users.push(newUser);
        localStorage.setItem(this.key, JSON.stringify(users));
		return { ok: true, text: "ההרשמה בוצעה בהצלחה.", item: newUser };
    }

    // check username and password
    login(user, pass) {
        const users = this.getUsers();

         for (let i = 0; i < users.length; i++) {
             if (users[i].user === user && users[i].pass === pass) {
                localStorage.setItem(this.loginKey, JSON.stringify(users[i]));
                return { ok: true, item: users[i] };
            }
        }
		return { ok: false, text: "שם משתמש או סיסמה שגויים." };
    }

    logout() {
        localStorage.removeItem(this.loginKey);
    }

    // get the user that is logged in now
    current() {
        const saved = localStorage.getItem(this.loginKey);
        if (!saved) {
            return null;
        }

		const data = JSON.parse(saved);
        const user = new User(data.name, data.user, data.pass, data.type);
        user.id = data.id;
        return user;
     }
}