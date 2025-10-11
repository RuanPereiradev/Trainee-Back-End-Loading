import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";

export interface IProjectRepository{
    findById(id: string): Promise<Result<Project>>;
    findAll(): Promise<Result<Project[]>>;
    save(project: Project): Promise<Result<Project>>;
    delete(project: Project): Promise<Result<void>>;
    update(project: Project): Promise<Result<Project>>;
}