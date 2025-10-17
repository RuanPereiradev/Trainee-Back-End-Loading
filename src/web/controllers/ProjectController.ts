import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { CreateProjectUseCase } from "../../userCases/project/CreateProjectUseCase";
import { error } from "console";
import { FindAllProjectUseCase } from "../../userCases/project/FindAllProjectUseCase";
import { FindProjectsByUserUseCase } from "../../userCases/membership/FindProjectsByUserUseCase";
import { UpdateProjectUseCase } from "../../userCases/project/UpdateProjectUseCase";
import { DeleteProjectUseCase } from "../../userCases/project/DeleteProjectUseCase";

export class ProjectController{
    private projectRepository: ProjectRepository;

    constructor(){
        this.projectRepository = new ProjectRepository();
    }

    async createProject(request: FastifyRequest, reply: FastifyReply){
        try{
            const {name, description, sector} = request.body as{
                name: string;
                description: string;
                sector: Sectors;
            }
            const useCase = new CreateProjectUseCase(this.projectRepository);

            const result = await useCase.execute({name, description, sector});

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
    async updateProject(request: FastifyRequest, reply: FastifyReply){
        try{
            const {id} = request.params as { id: string; }
            const {name, description,sector} = request.body as any

            const useCase = new UpdateProjectUseCase(this.projectRepository);
            const result = await useCase.execute({id,name, description, sector})

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
           const {id} = request.params as any;
           
           const useCase = new DeleteProjectUseCase(this.projectRepository);
           const result = await useCase.execute(id);

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