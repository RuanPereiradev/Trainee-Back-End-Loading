import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { Result } from "../../env/Result";
import { Project } from "../../domain/entities/Projects";

interface FindByIdProjectRequest{
    id: string;
} 

export class FindByIdProjectUseCase{
    constructor(private projectRepository: IProjectRepository){}

    async execute(request: FindByIdProjectRequest): Promise<Result<Project>>{
        try{
            const projectResult  = await this.projectRepository.findById(request.id);

            if(projectResult.isFailure){
                return Result.fail<Project>(projectResult.getError());
            }

            const project = projectResult.getValue();
             
            return Result.ok<Project>(project);

        }catch(error){

            if(error instanceof Error){
                return Result.fail<Project>(error.message);
            }

            return Result.fail<Project>("Erro desconhecido ao buscar por ID")
        }
    }
}