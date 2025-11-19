import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";

export interface IProjectRepository{
    findById(id: string): Promise<Result<Project>>;
    findBySectorId(sectorId: number): Promise<Result<Project[]>>
    findByName(name: string): Promise<Result<Project[]>>
    // findUsersByProjectId(projectId: string): Promise<Result<Project[]>>
    findAll(): Promise<Result<Project[]>>;
    save(project: Project): Promise<Result<Project>>;
    delete(id: string): Promise<Result<void>>;
    update(project: Project): Promise<Result<Project>>;
    findByIdAny(id: string): Promise<Result<Project>>;
    softDelete(id: string): Promise<Result<void>>;
    restore(id: string): Promise<Result<void>>;
    
}