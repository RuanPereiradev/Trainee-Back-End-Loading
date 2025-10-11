"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    constructor(name, email, password, role) {
        this._isActive = true;
        if (!name.trim())
            throw new Error("O nome não pode ser vazio");
        this._id = (0, uuid_1.v4)();
        this._name = name;
        this._email = email;
        this._password = password;
        this._role = role;
    }
    get id() { return this._id; }
    get name() { return this._name; }
    get email() { return this._email; }
    get role() { return this._role; }
    get isActive() { return this._isActive; }
    changeName(newName) { }
    changeRole(newRole) { }
    desactivate() {
        this._isActive = false;
        this._deletedAt = new Date();
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map