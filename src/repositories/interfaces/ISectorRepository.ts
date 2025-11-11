import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";

export interface ISectorRepository{
    findById(id: number): Promise<Result<Sectors>>;
    findAll(): Promise<Result<Sectors[]>>;
    findByName(name: string): Promise<Result<Sectors | null>>;
    save(sector: Sectors): Promise<Result<Sectors>>;
    delete(id: number): Promise<Result<void>>;
    update(sector: Sectors): Promise<Result<Sectors>>;
}