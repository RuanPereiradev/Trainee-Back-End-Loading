"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sectors = void 0;
const uuid_1 = require("uuid");
class Sectors {
    constructor(name, description, id) {
        this._isActive = true;
        this._deletedAt = null;
        if (!name.trim()) {
            throw new Error("O nome do setor não pode ser vázio.");
        }
        this._id = id ?? (0, uuid_1.v4)();
        this._name = name.trim();
        this._description = description?.trim();
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get isActive() {
        return this._isActive;
    }
    get deletedAt() {
        return this._deletedAt;
    }
    changeName(newName) {
        if (!newName.trim()) {
            throw new Error("O novo nome do setor nao pode ser vazio");
        }
        this._name = newName.trim();
    }
    desactivate() {
        this._isActive = false;
        this._deletedAt = new Date();
    }
    reactivate() {
        this._isActive = true;
        this._deletedAt = null;
    }
}
exports.Sectors = Sectors;
//# sourceMappingURL=Sectors.js.map