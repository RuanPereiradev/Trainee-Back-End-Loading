    import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { ProjectStatus } from "../../domain/enums/ProjectStatus";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";

interface CreateProjectRequest{
    name: string;
    sector: Sectors;
    status: ProjectStatus;
    description: string;
  
}

export class CreateProjectUseCase{
    constructor(private projectRepo: IProjectRepository){}

    async execute(request: CreateProjectRequest): Promise<Result<Project>>{
        try {

            const {name, sector, status, description} = request;

            const existingProject = await this.projectRepo.findByName(request.name);
            if(existingProject.isSuccess){
                return Result.fail<Project>("Name already in use");
            }
            
            if(!name || name.trim().length<3){
                return Result.fail<Project>("O nome do projeto deve ter pelo menos 3 caracteres")
            }

            if(!sector){
                return Result.fail<Project>("Setor é obrigatório")
            }
            if(!status){
                return Result.fail<Project>("Status é obrigatório")
 
            }

            const projectResult = Project.create(name,sector, status, description);

            if(projectResult.isFailure){
                return Result.fail<Project>(projectResult.getError());
            }

            const project = projectResult.getValue();

            const saveResult =  await this.projectRepo.save(project);

            if(saveResult.isFailure){
                return Result.fail<Project>(saveResult.getError())
            }

            return Result.ok<Project>(saveResult.getValue());
            
        } catch (error) {

            if(error instanceof Error){
                return Result.fail<Project>(error.message);
            }

            return Result.fail<Project>("Error desconhecido")
            
        }
    }
}