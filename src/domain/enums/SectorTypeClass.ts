import { SectorType } from "./SectorType";

export class SectorTypeClass{
    private  _name: SectorType;

    constructor(name: SectorType){
        this._name = name;
    }

    get name(){ return this._name; }
    set name(value: SectorType){
        this._name = value;
    }
}