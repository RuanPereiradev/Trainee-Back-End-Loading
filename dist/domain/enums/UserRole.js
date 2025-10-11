"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
class UserRole {
    constructor(role, id) {
        this._id = id ?? crypto.randomUUID();
        this._role = role;
    }
    get id() { return this._id; }
    get role() { return this._role; }
    set role(value) {
        this._role = value;
    }
}
exports.UserRole = UserRole;
//# sourceMappingURL=UserRole.js.map