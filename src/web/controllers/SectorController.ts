import { FastifyReply, FastifyRequest } from "fastify";
import { SectorRepository } from "../../repositories/prisma/SectorRepository";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { CreateSectorUseCase } from "../../useCases/sector/CreateSectorUseCase";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { FindSectorByIdUseCase } from "../../useCases/sector/FindSectorByIdUseCase";
import { FindSectorByNameUseCase } from "../../useCases/sector/FindSectorByNameUseCase";
import { UpdateSetorUseCase } from "../../useCases/sector/UpdateSectorUseCase";
import { FindAllSectorUseCase } from "../../useCases/sector/FindAllSectorUseCase";

export class SectorController{
    private sectorRepository: SectorRepository;
    private responseFilter: ApiResponseValidationFilter;

    constructor(){
        this.sectorRepository = new SectorRepository();
        this.responseFilter = new ApiResponseValidationFilter();
    }

    async createSector(request: FastifyRequest, reply: FastifyReply){
        try{
            const {name, description} = request.body as {
                name: string, 
                description: string;
            };
            const useCase = new CreateSectorUseCase(this.sectorRepository);

            const result = await useCase.execute({
                name, 
                description
            });
            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201 : 400).send(response);
        }catch(error){
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["erro ao criar setor"])
            );
            return reply.status(500).send(response)
        }
    }
    async findSectorById(request: FastifyRequest, reply: FastifyReply){
        try {
            const {id} = request.params as{
                id: number;
            }

            const useCase = new FindSectorByIdUseCase(this.sectorRepository);

            const result = await useCase.execute({id});

            const response  = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 201:400).send(response);
            
        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar setor por id"])
            )
            return reply.status(500).send(response)
        }
    }
    async findSectorByName(request: FastifyRequest, reply: FastifyReply){
        try {
            const {name} = request.body as any

            const useCase = new FindSectorByNameUseCase(this.sectorRepository);

            const result = await useCase.execute({name});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201:400).send(response);
        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar setor por nome"])
            )
            return reply.status(500).send(response);
        }
    }
    async findAll(request:FastifyRequest, reply: FastifyReply){
        try {
            const useCase = new FindAllSectorUseCase(this.sectorRepository);

            const result = await useCase.execute();

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 201:400).send(response);

        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar todos os setores"])
            )
            return reply.status(500).send(response)
        }
    }
    async updateSector(request: FastifyRequest, reply: FastifyReply){
        try {
            const {id} = request.params as{
                id: number
            }

            const {name, description} = request.body as any;

            const useCase = new UpdateSetorUseCase(this.sectorRepository);
            
            const result = await useCase.execute({id, name, description});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 201:400).send(response);

        } catch (error) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao atualizar os usuários por id"])
            )
            return reply.status(500).send(response)
        }
    }
}