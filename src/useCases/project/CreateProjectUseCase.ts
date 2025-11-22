import { ProjectStatusType } from "@prisma/client";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";

interface CreateProjectRequest{
    name: string;
    sectorId: number;
    status: ProjectStatusType;
    description: string;
    goals: string;
  
}

export class CreateProjectUseCase{
    constructor(
        private projectRepo: IProjectRepository,
        private sectorRepository: ISectorRepository
    ){}

    async execute(request: CreateProjectRequest): Promise<Result<Project>>{
        try {

            const sectorResult = await this.sectorRepository.findById(request.sectorId);
            if(sectorResult.isFailure){
                return Result.fail<Project>("Setor não encontrado.");
            }
            const sector = sectorResult.getValue()

            
            const {name, sectorId, status, description, goals} = request;

            const existingProject = await this.projectRepo.findByName(request.name);
            
            if(existingProject.isSuccess){
                return Result.fail<Project>("Name already in use");
            }
            
            if(!name || name.trim().length<3){
                return Result.fail<Project>("O nome do projeto deve ter pelo menos 3 caracteres")
            }

            if(!sectorId){
                return Result.fail<Project>("Setor é obrigatório")
            }
            if(!status){
                return Result.fail<Project>("Status é obrigatório")
 
            }
             if(!description){
                return Result.fail<Project>("Descrição é obrigatório")
            }
            if(!goals){
                return Result.fail<Project>("Metas é obrigatório")
            }

            const projectOrError = Project.create(request.name, sector,request.status,request.description, request.goals)
            const project = projectOrError.getValue();

            const saveResult = await this.projectRepo.save(project);

            return Result.ok<Project>(saveResult.getValue());
            
        } catch (error) {

            if(error instanceof Error){
                return Result.fail<Project>(error.message);
            }

            return Result.fail<Project>("Error desconhecido")
            
        }
    }
}