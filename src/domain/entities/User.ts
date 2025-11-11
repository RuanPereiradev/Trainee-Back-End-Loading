import { v4 as uuidv4 } from "uuid";
import{ Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { AuditableEntity } from "../common/AuditableEntity";
import { Result } from "../../env/Result";
import { RoleType } from "@prisma/client";

export class User extends AuditableEntity{
    private _id: string;
    private _name:string;
    private _email: Email;
    private _password: Password;
    private _role: RoleType;
    
    constructor( name: string, email: Email, password: Password, role: RoleType, id?: string ){
        super();
        if(!name.trim()) throw new Error("O nome não pode ser vazio")
        this._id = id ?? uuidv4();
        this._name = name;
        this._email = email;
        this._password = password;
        this._role = role;

    }

    get id() { return this._id; }

    get name() { return this._name; }

    get email() { return this._email; }

    get role() { return this._role; }

    get password (){return this._password}

    changeName(newName:string): Result<void>{
        if(!newName.trim()){
            return Result.fail("O nome não pode ser vazio");
        }
        this._name = newName.trim();
        return Result.ok();
    }

    changeRole(newRole: RoleType): Result<void>{
        if(!newRole){
            return Result.fail("O cargo não pode ser nulo");
        }

        this._role=newRole;
        return Result.ok();
    }

    changePassword(newPassword: Password): Result<void>{
        if(!newPassword){
            return Result.fail("A senha não pode ser nula");
        }
        this._password = newPassword;
        return Result.ok();
    }

    changeEmail(newEmail: Email): Result<void>{
         if(!newEmail){
            return Result.fail("O email não pode ser nulo");
        }
        this._email = newEmail;
        return Result.ok();
    }
    
}
