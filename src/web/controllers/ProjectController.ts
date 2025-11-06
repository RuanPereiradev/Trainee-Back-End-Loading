import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { CreateProjectUseCase } from "../../useCases/project/CreateProjectUseCase";
import { FindAllProjectUseCase } from "../../useCases/project/FindAllProjectUseCase";
import { UpdateProjectUseCase } from "../../useCases/project/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../useCases/project/DeleteProjectUseCase";
import { FindByIdProjectUseCase } from "../../useCases/project/FindByIdProjectUseCase";
import { ProjectStatus } from "../../domain/enums/ProjectStatus";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { ApiResponse } from "../Wrappers/ApiResponse";

export class ProjectController{

    private projectRepository: ProjectRepository;
    private responseFilter: ApiResponseValidationFilter;

    constructor(){
        this.projectRepository = new ProjectRepository();
        this.responseFilter = new ApiResponseValidationFilter();
    }

    async createProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {name,sector,status, description, goals} = request.body as{
                name: string;
                sector: Sectors;
                status: ProjectStatus;
                description: string;
                goals: string;
            }
            const useCase = new CreateProjectUseCase(this.projectRepository);

            const result = await useCase.execute({name, sector, status, description, goals});

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

            return reply.status(response.success ? 201:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar todos os Projetos"])
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

            return reply.status(response.success ? 201:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar Projeto por id"])
            )
                return reply.status(500).send(response);
        }
    }

    async updateProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {id} = request.params as { id: string; }
            const {name,sector,status,description, goals} = request.body as any;

            const useCase = new UpdateProjectUseCase(this.projectRepository);

            const result = await useCase.execute({id,name,sector,status,description, goals})

             const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201:400).send(response);


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

            return reply.status(response.success ? 201:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar Projeto por id"])
            )
                return reply.status(500).send(response);
        }
    }
}