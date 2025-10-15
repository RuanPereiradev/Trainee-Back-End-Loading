import { ProxyEnv } from "http";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";

interface UpdateProjectRequest{
    id: string;
    name?: string;
    description?: string;
    sector?: Sectors;
}

export class UpdateProjectUseCase{

    constructor(private projectRepo: IProjectRepository){}

    async execute(request: UpdateProjectRequest): Promise<Result<Project>>{
        try{
            const {id, name, description, sector} = request;

            const projectResult = await this.projectRepo.findById(id);
            if(projectResult.isFailure){
                return Result.fail<Project>(projectResult.getError());
            }

            const project = projectResult.getValue();

            if(name){
                const nameResult = project.changeName(name);
                if(nameResult.isFailure){
                    return Result.fail<Project>(nameResult.getError());
                }
            }

            if(description){
                project.changeDescription(description);
            }

            if(sector){
                project.changeSector(sector);
            }

            const updateResult = await this.projectRepo.update(project);

            if(updateResult.isFailure){
                return Result.fail<Project>(updateResult.getError());
            }

            return Result.ok<Project>(updateResult.getValue());

        }catch(error){

            if(error instanceof Error){
                return Result.fail<Project>(error.message);
            }

            return Result.fail<Project>("Erro desconhecido ao atualizar o projeto")
        }
    }

}