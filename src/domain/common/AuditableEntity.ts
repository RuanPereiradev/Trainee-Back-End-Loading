export abstract class AuditableEntity{
    protected _isActive: boolean = true;
    protected _createdAt: Date;
    protected _updatedAt: Date;
    protected _deletedAt: Date | null = null;

    constructor(){
        const now  = new Date();
        this._createdAt = now;
        this._updatedAt = now
    }
    get isActive(): boolean{
        return this._isActive;
    }
    get createdAt(): Date{
        return this.createdAt;
    }
    get updatedAt(): Date{
        return this._updatedAt;
    }
    get deletedAt(): Date | null{
        return this._deletedAt;
    }
    protected touch(){
        this._updatedAt = new Date();
    }

    deactivate(): void{
        this._isActive = false;
        this._deletedAt = new Date();
        this.touch();
    }
    reactivate(): void{
        this._isActive = true;
        this._deletedAt = null;
        this.touch();
    }

}