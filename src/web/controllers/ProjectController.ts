import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { CreateProjectUseCase } from "../../useCases/project/CreateProjectUseCase";
import { FindAllProjectUseCase } from "../../useCases/project/FindAllProjectUseCase";
import { UpdateProjectUseCase } from "../../useCases/project/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../useCases/project/DeleteProjectUseCase";
import { FindByIdProjectUseCase } from "../../useCases/project/FindByIdProjectUseCase";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { ProjectStatusType } from "@prisma/client";
import { SectorRepository } from "../../repositories/prisma/SectorRepository";
import { FindProjectBySectorUsecase } from "../../useCases/project/FindProjectBySectorUseCase";
import { RestoreProjectUseCase } from "../../useCases/project/RestoreProjectUseCase";
import { ListProjectsPaginatedUseCase } from "../../useCases/project/ListProjectsPaginationUseCase";
// import { FindProjectBySectorUsecase } from "../../useCases/project/FindProjectBySectorUseCase";

export class ProjectController{

    private projectRepository: ProjectRepository;
    private responseFilter: ApiResponseValidationFilter;
    private sectorRepository: SectorRepository;

    constructor(){
        this.projectRepository = new ProjectRepository();
        this.responseFilter = new ApiResponseValidationFilter();
        this.sectorRepository = new SectorRepository();
    }

    async createProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {name,sectorId,status, description, goals} = request.body as{
                name: string;
                sectorId: number;
                status: ProjectStatusType;
                description: string;
                goals: string;
            }
            const useCase = new CreateProjectUseCase(this.projectRepository, this.sectorRepository);

            const result = await useCase.execute({name,sectorId, status,description, goals});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao criar Projeto"])
            )
            return reply.status(500).send(response);
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply){
        try{
            const useCase = new FindAllProjectUseCase(this.projectRepository);

            const result = await useCase.execute();

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar todos os Projetos"])
            )
                return reply.status(500).send(response);
        }
    }

    async findProjectBySector(request: FastifyRequest, reply: FastifyReply){
        try {
            const {sectorId} = request.params as{
                sectorId:string
            };

            const numberSectorId = Number(sectorId)
            
            const useCase = new FindProjectBySectorUsecase(this.projectRepository);

            const result = await useCase.execute({sectorId: numberSectorId});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);

        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar projeto por setor"])
            )
            return reply.status(500).send(response);
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply){
        try{
            const{id} = request.params as{
                id: string;
            }

            const useCase = new FindByIdProjectUseCase(this.projectRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar Projeto por id"])
            )
                return reply.status(500).send(response);
        }
    }

    async listPagineted(request: FastifyRequest, reply: FastifyReply){
        try {
            const {page = 1, pageSize = 10} = request.query as any;

            const useCase = new ListProjectsPaginatedUseCase(this.projectRepository);

            const result = await useCase.execute({
                page: Number(page),
                pageSize: Number(pageSize)
            });

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);

        } catch (error:any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar todos os projetos"])
            )
            return reply.status(500).send(response)
        }
    }
    async updateProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {id} = request.params as { id: string; }
            const {name,sector,status,description, goals} = request.body as any;

            const useCase = new UpdateProjectUseCase(this.projectRepository);

            const result = await useCase.execute({id,name,sector,status,description, goals})

             const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao atualizar projeto"])
            )
                return reply.status(500).send(response);
        }
    }

    async deleteProject(request: FastifyRequest, reply: FastifyReply){        
        try{
           const {id} = request.params as {id: string};
           
           const useCase = new DeleteProjectUseCase(this.projectRepository);

           const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar Projeto por id"])
            )
                return reply.status(500).send(response);
        }
    }
    
    async restore(request: FastifyRequest, reply: FastifyReply){
        try {
            const {id} = request.params as {id: string};

            const useCase = new RestoreProjectUseCase(this.projectRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 200:400).send(response);
        } catch (error: any) {
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }
}