import { User } from "./User"
import { Project } from "./Projects";
import { v4 as uuidv4 } from "uuid";
import { AuditableEntity } from "../common/AuditableEntity";


export class Membership extends AuditableEntity{
    private _id: string;
    private _user: User;
    private _project: Project;
    private _joinedAt: Date;
    private _leftAt: Date | null = null;

    constructor(user: User, project: Project, id?: string, joinedAt?: Date){
        super();
        if(!user){
            throw new Error("O usuário nao pode ser nulo, ao criar vinculo")
        }
        if(!project){
            throw new Error("O projeto nao pode ser nulo ao criar um vinculo")
        }
        this._id = id ?? crypto.randomUUID();
        this._user = user;
        this._project = project;
        this._joinedAt = joinedAt ?? new Date();
    }

    get id(): string{
        return this._id;
    }
    
    get user(): User {
    return this._user;
    }

    get project(): Project{
        return this._project;
    }

    get joinedAt(): Date {
        return this._joinedAt;
    }
    get leftAt(): Date | null{
        return this._leftAt 
    }

    leaveProject(): void{
        if(this._leftAt !== null){
            throw new Error("O usuário já saiu desse projeto")
        }
        this._leftAt = new Date();
    }
    rejoinProject(): void{
        if(this._leftAt=== null){
            throw new Error("O usuário já está participando deste projeto");
        }
        this._leftAt = null;
        this._joinedAt = new Date();
    }
}