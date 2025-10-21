import { FastifyRegister, FastifyReply } from "fastify";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { FastifyRequest } from "fastify";
import { Project } from "../../domain/entities/Projects";
import { User } from "../../domain/entities/User";
import { CreateMembershipUseCase } from "../../userCases/membership/CreateMembershipUseCase";
import { UpdateMembershipUseCase } from "../../domain/tests/DeleteMembershipUseCaseTeste";
import { error } from "console";
import { DeleteMembershipUseCase } from "../../userCases/membership/DeleteMembershipUseCase";
import { FindAllProjectUseCase } from "../../userCases/project/FindAllProjectUseCase";
import { FindMembersByProjectUseCase } from "../../userCases/membership/FindMembersByProjectUseCase";
import { FindProjectsByUserUseCase } from "../../userCases/membership/FindProjectsByUserUseCase";
import { FindMembershipsByUserUseCase } from "../../userCases/membership/FindMembershipByUseCase";

export class MembershipController{
    private membershipRepository: MembershipRepository;

    constructor(){
        this.membershipRepository = new MembershipRepository();
    }

    async createMembership(request: FastifyRequest, reply: FastifyReply){

        try{
            const {user, project} = request.body as{
                user: User;
                project: Project
            }
            const useCase= new CreateMembershipUseCase(this.membershipRepository);
            const result = await useCase.execute({user, project})

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()});
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao criar relacionamento"})
        }
    }
    
    async updateMembership(request: FastifyRequest, reply: FastifyReply){

        try{
            const {id} = request.params as{
                id: string;
            }

            const {rejoin, leave} = request.body as{
                rejoin: boolean;
                leave: boolean;
            }

            const useCase = new UpdateMembershipUseCase(this.membershipRepository);
            const result = await useCase.execute({id, rejoin, leave});

            if(result.isFailure){
                return reply.status(400).send({ error: result.getError() })
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao atualizar o relacionamento"})
        }
    }

    async deleteMembership(request: FastifyRequest, reply: FastifyReply){

        try{
            const {id} = request.params as{ 
                id: string;
            }
            const useCase = new DeleteMembershipUseCase(this.membershipRepository);
            const result = await useCase.execute(id);

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()})
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.log(error);
            return reply.status(500).send({error: "Erro ao deletar relacionamento"});
        }
    }

    async findMembershipByProject(request: FastifyRequest, reply: FastifyReply){

        try{
            const{projectId} = request.params as{
                projectId: string;
            }
            const useCase = new FindMembersByProjectUseCase(this.membershipRepository);
            const result = await useCase.execute({projectId});

            if(result.isFailure){
                return reply.status(400).send(result.getError());
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            return reply.status(500).send({error: "Erro ao buscar mebros do projeto"})
        }
    }

    async findProjectByUser(request: FastifyRequest, reply: FastifyReply){

        try{
            const {userId} = request.params as{
                userId: string;
            }
            if(!userId){
                return reply.status(400).send({error: "Id do usuário é obrigatorio"})
            }

            const useCase = new FindProjectsByUserUseCase(this.membershipRepository);

            const result = await useCase.execute(userId);

            if(result.isFailure){
                return reply.status(404).send({error: result.getError()});
            }

            return reply.status(200).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro interno ao buscar projeto do usuário"})
        }
    }

    async findMembershipByUser(request: FastifyRequest ,reply: FastifyReply){
        
        try{
            const {userId} = request.params as {userId: string};

            if(!userId){
                return reply.status(400).send({error: "O id do usuário é obrigatório"})
            }
            const useCase = new FindMembershipsByUserUseCase(this.membershipRepository);

            const result = await useCase.execute(userId);

            if(result.isFailure){
                return reply.status(404).send({error: result.getError()})
            }

            return reply.status(200).send(result.getValue());

        }catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Erro interno ao buscar memberships do usuário" });
        }
    }
}