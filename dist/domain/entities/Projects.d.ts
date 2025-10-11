import { Sectors } from "./Sectors";
export declare class Project {
    private readonly _id;
    private _name;
    private _description;
    private _sector;
    private _isActive;
    private _deletedAt;
    constructor(name: string, sector: Sectors, description?: string, id?: string);
    get id(): string;
    get name(): string;
    get description(): string;
    get sector(): Sectors;
    get isActive(): boolean;
    get deletedAt(): Date | null;
    changeName(newName: string): void;
    changeDescription(newDescription: string): void;
    changeSector(newSector: Sectors): void;
    deactivate(): void;
    reactivate(): void;
}
//# sourceMappingURL=Projects.d.ts.map