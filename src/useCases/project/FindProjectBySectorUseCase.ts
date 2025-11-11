import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";

interface FindProjectBySectorRequest{
    sectorId: number;
}

export class FindProjectBySectorUsecase{
    constructor(private projectRepository: IProjectRepository){}

    async execute(request: FindProjectBySectorRequest): Promise<Result<Project[]>>{
        try {
            const projectResult = await this.projectRepository.findBySectorId(request.sectorId)

            if(projectResult.isFailure){
                return Result.fail<Project[]>(projectResult.getError())
            }

            const projects = projectResult.getValue();

            if(projects.length === 0){
                return Result.fail<Project[]>("Nehum projeto encontrado")
            }
            
            return Result.ok<Project[]>(projects)

            } catch (error: any) {
            return  Result.fail<Project[]>(error.message)
        }
    }
}