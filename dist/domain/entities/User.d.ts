import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { UserRole } from "../enums/UserRole";
export declare class User {
    private _id;
    private _name;
    private _email;
    private _password;
    private _role;
    private _isActive;
    private _deletedAt?;
    constructor(name: string, email: Email, password: Password, role: UserRole);
    get id(): string;
    get name(): string;
    get email(): Email;
    get role(): UserRole;
    get isActive(): boolean;
    changeName(newName: string): void;
    changeRole(newRole: UserRole): void;
    desactivate(): void;
}
//# sourceMappingURL=User.d.ts.map