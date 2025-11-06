import { v4 as uuidv4 } from "uuid";
import { Sectors } from "./Sectors";
import { Result } from "../../env/Result";
import { AuditableEntity } from "../common/AuditableEntity";
import { ProjectStatus } from "../enums/ProjectStatus";

export class Project extends AuditableEntity{
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _sector: Sectors;
  private _status: ProjectStatus;
  private _goals: string;

   constructor(name: string,  sector: Sectors,status: ProjectStatus, goals: string, description?: string, id?: string) {
    super();
    this._id = id ?? uuidv4();
    this._name = name;
    this._sector = sector;
    this._description = description ?? "";
    this._status = status;
    this._goals = goals; 
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get sector(): Sectors { return this._sector; }
  get status(): ProjectStatus{return this.status}
  get goals(): string{return this.goals}
  

  public static create(name: string, sector: Sectors,status: ProjectStatus,goals: string, description?: string, id?: string): Result<Project> {
    if (!name.trim()) {
      return Result.fail<Project>("O nome do projeto não pode ser vazio.");
    }
    return Result.ok<Project>(new Project(name.trim(),sector, status, goals, description?.trim(), id));
  }

  changeName(newName: string): Result<void> {
    if (!newName.trim()) {
      return Result.fail("O nome não pode ser vazio");
    }
    this._name = newName.trim();
    return Result.ok();
  }

  changeStatus(newStatus: ProjectStatus): Result<void>{
    if(!newStatus){
      return Result.fail("O status não pode ser vazio");
    }
    this._status = newStatus;
    return Result.ok(); 
 }

  changeDescription(newDescription: string): void {
    this._description = newDescription.trim();
  }

  changeSector(newSector: Sectors): void {
    this._sector = newSector;
  }
  changeGoals(newGoal: string): void {
    this._goals = newGoal;
  }

}
