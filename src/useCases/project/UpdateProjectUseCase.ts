import { ProxyEnv } from "http";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { ProjectStatusType } from "@prisma/client";

interface UpdateProjectRequest{
    id: string;
    name?: string;
    sector?: Sectors;
    status?: ProjectStatusType;
    description?: string;
    goals?: string;
}

export class UpdateProjectUseCase{

    constructor(private projectRepo: IProjectRepository){}

    async execute(request: UpdateProjectRequest): Promise<Result<Project>>{
        try{
            const {id, name, sector, status, description, goals} = request;

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

             if(sector){
                project.changeSector(sector);
            }

            if(status){
                project.changeStatus(status);
            }

            if(description){
                project.changeDescription(description);
            }

            if(goals){
                project.changeGoals(goals);
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