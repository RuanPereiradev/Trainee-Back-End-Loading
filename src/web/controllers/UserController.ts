import { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { CreateUserUseCase } from "../../useCases/user/CreateUserUseCase";
import { FindAllUserUseCase } from "../../useCases/user/FindAllUsersUseCase";
import { FindUserByIdUseCase } from "../../useCases/user/FindUserByIdUseCase";
import { UpdateUserUseCase } from "../../useCases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../useCases/user/DeleteUserUseCase";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { RoleType } from "@prisma/client";
import { RestoreUserUseCase } from "../../useCases/user/RestoreUserUseCase";
import { ListUserPaginatedUseCase } from "../../useCases/user/ListUserPaginationUseCase";
import { LoginUserUseCase } from "../../useCases/user/LoginUserUseCase.ts";

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
                role
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

                return reply.status(response.success? 200:400).send(response);

            }catch(error){
                console.error(error);
                const response = this.responseFilter.handleResponse(
                    ApiResponse.fail(["Erro ao retornar todos os usuários"])
                )
                return reply.status(500).send(response)
            }
        }

    async listPagineted(request: FastifyRequest, reply: FastifyReply){
        try {
            const {page = 1, pageSize = 10} = request.query as any;

            const useCase = new ListUserPaginatedUseCase(this.userRepository);

            const result = await useCase.execute({
                page: Number(page),
                pageSize: Number(pageSize)
            });

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 200:400).send(response);
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar os User(pagination)"])
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
        
            return reply.status(response.success? 200:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }

    async findByIdAny(request: FastifyRequest, reply: FastifyReply){
        try {
            const {id} = request.params as{
                id: string;
            }

            const useCase = new FindUserByIdUseCase(this.userRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 200:400).send(response)
        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar usuario por id"])
            )
            return reply.status(500).send(response)
        }
    }
    async userLogin(request: FastifyRequest, reply: FastifyReply){
        try{
        const {email, password} = request.body as {
            email: string,
            password: string;
        }
        
        const useCase = new LoginUserUseCase(this.userRepository);

        const result = await useCase.execute({email, password});

        const response = this.responseFilter.handleResponse(result);

        return reply.status(response.success ? 200:400).send(response);
        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao login"])
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
        
            return reply.status(response.success? 200:400).send(response);

        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao atualizar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }

    async softDelete (request: FastifyRequest, reply: FastifyReply){
        try{
            const {id} = request.params as {id: string};

            const useCase = new DeleteUserUseCase(this.userRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result)
        
            return reply.status(response.success? 200:400).send(response);

        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }

    async restore(request: FastifyRequest, reply: FastifyReply){
        try {
            const {id} =  request.params as {id: string};

            const useCase = new RestoreUserUseCase(this.userRepository);

            const result = await useCase.execute({id});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 200:400).send(response);

        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }
   


}