export declare class Sectors {
    private readonly _id;
    private _name;
    private _description;
    private _isActive;
    private _deletedAt;
    constructor(name: string, description: string, id?: string);
    get id(): string;
    get name(): string;
    get isActive(): boolean;
    get deletedAt(): Date | null;
    changeName(newName: string): void;
    desactivate(): void;
    reactivate(): void;
}
//# sourceMappingURL=Sectors.d.ts.map