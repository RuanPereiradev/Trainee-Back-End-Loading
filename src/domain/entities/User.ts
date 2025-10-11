import { v4 as uuidv4 } from "uuid";
import{ Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { UserRole } from "../enums/UserRole";
import { AuditableEntity } from "../common/AuditableEntity";

export class User extends AuditableEntity{
    private _id: string;
    private _name:string;
    private _email: Email;
    private _password: Password;
    private _role: UserRole;
    // private _isActive: boolean = true;
    // private _deletedAt?: Date;

    constructor( name: string, email: Email, password: Password, role: UserRole){
        super();
        if(!name.trim()) throw new Error("O nome não pode ser vazio")
        this._id = uuidv4();
        this._name = name;
        this._email = email;
        this._password = password;
        this._role = role;

    }

    get id() { return this._id; }

    get name() { return this._name; }

    get email() { return this._email; }

    get role() { return this._role; }

    // get isActive() { return this._isActive; }

    changeName(newName:string){}
    changeRole(newRole: UserRole){}

    // desactivate(){
    //     this._isActive = false;
    //     this._deletedAt = new Date();
    // }
}
