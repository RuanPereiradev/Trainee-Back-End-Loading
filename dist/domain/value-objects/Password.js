"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
class Password {
    constructor(password) {
        if (password.length < 8) {
            throw new Error("A senha deve ter no mínimo 8 caracteres");
        }
        this._password = password;
    }
    get value() {
        return this._password;
    }
}
exports.Password = Password;
//# sourceMappingURL=Password.js.map