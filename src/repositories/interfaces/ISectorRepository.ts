import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";

export interface ISectorRepository{
    findById(id: string): Promise<Result<Sectors>>;
    findAll(): Promise<Result<Sectors[]>>;
    save(sector: Sectors): Promise<Result<Sectors>>;
    delete(sector: Sectors): Promise<Result<Sectors>>;
    update(sector: Sectors): Promise<Result<Sectors>>;
}