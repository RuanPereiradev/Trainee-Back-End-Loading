"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = void 0;
const uuid_1 = require("uuid");
class Membership {
    constructor(user, project, id, joinedAt) {
        this._leftAt = null;
        if (!user) {
            throw new Error("O usuário nao pode ser nulo, ao criar vinculo");
        }
        if (!project) {
            throw new Error("O projeto nao pode ser nulo ao criar um vinculo");
        }
        this._id = id ?? (0, uuid_1.v4)();
        this._user = user;
        this._project = project;
        this._joinedAt = joinedAt ?? new Date();
    }
    get id() {
        return this._id;
    }
    get project() {
        return this._project;
    }
    get joinedAt() {
        return this._joinedAt;
    }
    get leftAt() {
        return this._leftAt;
    }
    leaveProject() {
        if (this._leftAt !== null) {
            throw new Error("O usuário já está participando desse projeto");
        }
        this._leftAt = null;
        this._joinedAt = new Date();
    }
}
exports.Membership = Membership;
//# sourceMappingURL=Membership.js.map