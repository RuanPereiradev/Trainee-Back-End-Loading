import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { CreateUserUseCase } from "../../useCases/user/CreateUserUseCase";
import { FindAllUserUseCase } from "../../useCases/user/FindAllUsersUseCase";
import { FindUserByIdUseCase } from "../../useCases/user/FindUserByIdUseCase";
import { UpdateUserUseCase } from "../../useCases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../useCases/user/DeleteUserUseCase";
import { error } from "console";
import { resolveObjectURL } from "buffer";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { RoleType } from "@prisma/client";

export class UserController{
    private userRepository: UserRepository;
    private responseFilter: ApiResponseValidationFilter;

    constructor(){
        this.userRepository = new UserRepository();
        this.responseFilter = new ApiResponseValidationFilter();
    }


  async createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { name, email, password, role } = request.body as {
            name: string;
            email: string;
            password: string;
            role: RoleType; 
        };

        const useCase = new CreateUserUseCase(this.userRepository);

        const result = await useCase.execute({
            name,
            email,
            password,
            role // agora passa UserRole correto
        });

        const response = this.responseFilter.handleResponse(result);

        return reply.status(response.success ? 201 : 400).send(response);
    } catch (error) {
        console.error(error);
        const response = this.responseFilter.handleResponse(
            ApiResponse.fail(["Erro ao criar usuário"])
        );
        return reply.status(500).send(response);
    }
}
    async findAll(request:FastifyRequest, reply: FastifyReply){
        try{
            const useCase = new FindAllUserUseCase(this.userRepository);

            const result = await useCase.execute();

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 201:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar todos os usuários"])
            )
            return reply.status(500).send(response)
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply){

        try{
            const{id} = request.params as{
                id: string;
            }
            
            const useCase = new FindUserByIdUseCase(this.userRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);
    
            return reply.status(response.success? 201:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }

    async updateUser(request: FastifyRequest, reply: FastifyReply) {
        try {
        const { id } = request.params as { id: string };

        const {name, email, password,role} = request.body as any;

        const useCase = new UpdateUserUseCase(this.userRepository);

        const result = await useCase.execute({id,name, email, password, role});

        const response = this.responseFilter.handleResponse(result)
    
        return reply.status(response.success? 201:400).send(response);

        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao atualizar os usuários por id"])
            )
            return reply.status(500).send(response)
    }
  }

    async deleteUser (request: FastifyRequest, reply: FastifyReply){
        try{
            const {id} = request.params as {id: string};

            const useCase = new DeleteUserUseCase(this.userRepository);

            const result = await useCase.execute({id});

        const response = this.responseFilter.handleResponse(result)
    
        return reply.status(response.success? 201:400).send(response);


        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }

}