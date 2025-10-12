import { v4 as uuidv4 } from "uuid";
import { RoleType } from "./RoleType";

export class UserRole {
    private readonly _id: string;
    private _role: RoleType;

    constructor(role: RoleType, id?: string){
        this._id = id ?? uuidv4();
        this._role = role;
    }

    get id(){ return this._id; }
    get role(){ return this._role; }

    set role(value: RoleType){
        this._role = value;
    }
}
