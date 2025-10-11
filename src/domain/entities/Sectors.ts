import { v4 as uuidv4 } from "uuid";
import { AuditableEntity } from "../common/AuditableEntity";

export class Sectors extends AuditableEntity{
    private readonly _id: string;
    private _name: string;
    private _description: string;
    // private _isActive: boolean = true;
    // private _deletedAt: Date | null = null;

    constructor(name: string,description: string, id?: string){
        super();
        if(!name.trim()){
            throw new Error("O nome do setor não pode ser vázio.")
        }

        this._id = id ?? uuidv4();
        this._name = name.trim();
        this._description = description?.trim();
    }

    get id(): string {
        return this._id;
    }
    get name(): string{
        return this._name
    }
    get isActive(): boolean{
        return this._isActive;
    }
    get deletedAt(): Date | null{
        return this._deletedAt;
    }

    changeName(newName: string): void{
        if(!newName.trim()){
            throw new Error("O novo nome do setor nao pode ser vazio");
        }
        this._name = newName.trim();
    }

    // desactivate(): void{
    //     this._isActive = false;
    //     this._deletedAt = new Date();
    // }

    // reactivate(): void{
    //     this._isActive = true;
    //     this._deletedAt = null;

    // }

}