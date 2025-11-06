import { v4 as uuidv4 } from "uuid";
import { AuditableEntity } from "../common/AuditableEntity";

export class Sectors extends AuditableEntity{
    private  _id: string;
    private _name: string;
    private _description: string;

    constructor(name: string,description: string, id: string){
        super();
        if(!name.trim()){
            throw new Error("O nome do setor não pode ser vázio, escolha um setor entre = Engenharia, RH, TI, Desenvolvimento de Sofware,Vendas, MKT, Logistica,.")
        }

        this._id = id;
        this._name = name.trim();
        this._description = description?.trim();
    }

    get id(): string {
        return this._id;
    }
    get name(): string{
        return this._name
    }
    get description(): string{
        return this._description
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

}