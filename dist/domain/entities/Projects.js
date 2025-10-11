"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const uuid_1 = require("uuid");
class Project {
    constructor(name, sector, description, id) {
        this._isActive = true;
        this._deletedAt = null;
        if (!name.trim()) {
            throw new Error("O nome do projeto não pode ser vazio.");
        }
        this._id = id ?? (0, uuid_1.v4)();
        this._name = name.trim();
        this._sector = sector;
        this._description = description?.trim() ?? "";
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get sector() {
        return this._sector;
    }
    get isActive() {
        return this._isActive;
    }
    get deletedAt() {
        return this._deletedAt;
    }
    changeName(newName) {
        if (!newName.trim()) {
            throw new Error("O novo nome do projeto não pode ser vazio.");
        }
        this._name = newName.trim();
    }
    changeDescription(newDescription) {
        this._description = newDescription.trim();
    }
    changeSector(newSector) {
        this._sector = newSector;
    }
    deactivate() {
        this._isActive = false;
        this._deletedAt = new Date();
    }
    reactivate() {
        this._isActive = true;
        this._deletedAt = null;
    }
}
exports.Project = Project;
//# sourceMappingURL=Projects.js.map