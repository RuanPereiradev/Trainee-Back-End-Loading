import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { CreateProjectUseCase } from "../../userCases/project/CreateProjectUseCase";
import { FindAllProjectUseCase } from "../../userCases/project/FindAllProjectUseCase";
import { UpdateProjectUseCase } from "../../userCases/project/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../userCases/project/DeleteProjectUseCase";
import { FindByIdProjectUseCase } from "../../userCases/project/FindByIdProjectUseCase";
import { ProjectStatus } from "../../domain/enums/ProjectStatus";

export class ProjectController{

    private projectRepository: ProjectRepository;

    constructor(){
        this.projectRepository = new ProjectRepository();
    }

    async createProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {name,sector,status, description} = request.body as{
                name: string;
                sector: Sectors;
                status: ProjectStatus;
                description: string;
            }
            const useCase = new CreateProjectUseCase(this.projectRepository);

            const result = await useCase.execute({name, sector, status, description});

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()})
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao criar projeto"})
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply){
        try{
            const useCase = new FindAllProjectUseCase(this.projectRepository);
            const result = await useCase.execute();

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()});
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "erro interno ao retornar todos os projetos"})
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply){
        try{
            const{id} = request.params as{
                id: string;
            }

            const useCase = new FindByIdProjectUseCase(this.projectRepository);
            const result = await useCase.execute({id});

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()})
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.log(error);
            return reply.status(500).send({error: "Erro interno ao por retornar id"})
        }
    }

    async updateProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const {id} = request.params as { id: string; }
            const {name,sector,status,description} = request.body as any;

            const useCase = new UpdateProjectUseCase(this.projectRepository);
            const result = await useCase.execute({id,name,sector,status,description})

            if(result.isFailure){
                return reply.status(400).send({ error: result.getError() });
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao atualizar o projeto"})
        }
    }

    async deleteProject(request: FastifyRequest, reply: FastifyReply){
        
        try{
           const {id} = request.params as {id: string};
           
           const useCase = new DeleteProjectUseCase(this.projectRepository);
           const result = await useCase.execute({id});

           if(result.isFailure){
            return reply.status(400).send({error: result.getValue()});
           }

           return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao excluir projeto"})
        }
    }
}