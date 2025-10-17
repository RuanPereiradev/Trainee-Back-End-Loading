import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { UserRole } from "../../domain/enums/UserRole";
import { CreateUserUseCase } from "../../userCases/user/CreateUserUseCase";
import { FindAllUserUseCase } from "../../userCases/user/FindAllUsersUseCase";
import { FindUserByIdUseCase } from "../../userCases/user/FindUserByIdUseCase";
import { UpdateUserUseCase } from "../../userCases/user/UpdateUserUseCase";
import { userRoutes } from "../routes/ProjectRoutes";
import { DeleteUserUseCase } from "../../userCases/user/DeleteUserUseCase";
import { error } from "console";
import { resolveObjectURL } from "buffer";

export class UserController{
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepository();
    }

    async createUser(request: FastifyRequest, reply: FastifyReply){
        try{
            const {name, email, password, role} = request.body as {
                name: string;
                email: string;
                password: string;
                role: UserRole;
            }

            const useCase = new CreateUserUseCase(this.userRepository);

            const result = await useCase.execute({name, email, password, role});

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()});
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao criar usuário"})
        }
    }
    async findAll(request:FastifyRequest, reply: FastifyReply){
        try{
            const useCase = new FindAllUserUseCase(this.userRepository);
            const result = await useCase.execute();

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()})   
            }

            return reply.status(201).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro interno ao retornar todos os usuários"})
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply){
        try{
            const{id} = request.params as{
                id: string;
            }
            const useCase = new FindUserByIdUseCase(this.userRepository);
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

    async updateUser(request: FastifyRequest, reply: FastifyReply) {
        try {
        const { id } = request.params as { id: string };
        const {name, email, password,role} = request.body as any;

        const useCase = new UpdateUserUseCase(this.userRepository);
        const result = await useCase.execute({id,name, email, password, role});

        if (result.isFailure) {
            return reply.status(400).send({ error: result.getError() });
        }

        return reply.status(201).send(result.getValue());

        } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Erro ao atualizar usuário" });
    }
  }

    async deleteUser (request: FastifyRequest, reply: FastifyReply){
        try{
            const {id} = request.params as any;

            const useCase = new DeleteUserUseCase(this.userRepository);
            const result = await useCase.execute(id);

            if(result.isFailure){
                return reply.status(400).send({error: result.getError()})
            }

            return reply.status(200).send(result.getValue());

        }catch(error){
            console.error(error);
            return reply.status(500).send({error: "Erro ao atualizar usuário"})
        }
    }

}