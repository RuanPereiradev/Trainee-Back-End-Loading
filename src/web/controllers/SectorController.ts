// import { FastifyReply, FastifyRequest } from "fastify";
// import { SectorRepository } from "../../repositories/prisma/SectorRepository";
// import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
// import { CreateSectorUseCase } from "../../useCases/sector/CreateSectorUseCase";
// import { ApiResponse } from "../Wrappers/ApiResponse";

// export class SectorController{
//     private sectorRepository: SectorRepository;
//     private responseFilter: ApiResponseValidationFilter;

//     constructor(){
//         this.sectorRepository = new SectorRepository();
//         this.responseFilter = new ApiResponseValidationFilter();
//     }

//     async createSector(request: FastifyRequest, reply: FastifyReply){
//         try{
//             const {name, description} = request.body as {
//                 name: string, 
//                 description: string;
//             };
//             const useCase = new CreateSectorUseCase(this.sectorRepository);

//             const result = await useCase.execute({
//                 name, 
//                 description
//             });
//             const response = this.responseFilter.handleResponse(result);

//             return reply.status(response.success ? 201 : 400).send(response);
//         }catch(error){
//             console.error(error);
//             const response = this.responseFilter.handleResponse(
//                 ApiResponse.fail(["erro ao criar setor"])
//             );
//             return reply.status(500).send(response)
//         }
//     }
// }