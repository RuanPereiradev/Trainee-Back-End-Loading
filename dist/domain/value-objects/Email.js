"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(email) {
        if (!this.validateEmail(email)) {
            throw new Error("Email inválido");
        }
        this._email = email;
    }
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    get value() {
        return this._email;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map