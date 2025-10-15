import { v4 as uuidv4 } from "uuid";
import { Sectors } from "./Sectors";
import { Result } from "../../env/Result";
import { AuditableEntity } from "../common/AuditableEntity";

export class Project extends AuditableEntity{
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _sector: Sectors;
//   private _isActive: boolean = true;
//   private _deletedAt: Date | null = null;

  private constructor(name: string, sector: Sectors, description?: string, id?: string) {
    super();
    this._id = id ?? uuidv4();
    this._name = name;
    this._sector = sector;
    this._description = description ?? "";
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get sector(): Sectors { return this._sector; }

  
//   get isActive(): boolean { return this._isActive; }
//   get deletedAt(): Date | null { return this._deletedAt; }

  public static create(name: string, sector: Sectors, description?: string, id?: string): Result<Project> {
    if (!name.trim()) {
      return Result.fail<Project>("O nome do projeto não pode ser vazio.");
    }
    return Result.ok<Project>(new Project(name.trim(), sector, description?.trim(), id));
  }

  changeName(newName: string): Result<void> {
    if (!newName.trim()) {
      return Result.fail("O nome não pode ser vazio");
    }
    this._name = newName.trim();
    return Result.ok();
  }

  changeDescription(newDescription: string): void {
    this._description = newDescription.trim();
  }

  changeSector(newSector: Sectors): void {
    this._sector = newSector;
  }

//   deactivate(): void {
//     this._isActive = false;
//     this._deletedAt = new Date();
//   }

//   reactivate(): void {
//     this._isActive = true;
//     this._deletedAt = null;
//   }
}
