import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";

interface FindSectorByIdRequest{
    id: number
}

export class FindSectorByIdUseCase{
    constructor (private sectorRepository: ISectorRepository){}
    
    async execute(request: FindSectorByIdRequest): Promise<Result<Sectors>>{
        try{
            const sector = await this.sectorRepository.findById(request.id);

            if(!sector){
                return Result.fail<Sectors>("setor nao encontrado")
            }

            return Result.ok<Sectors>();
                
        }catch(error){
            if(error instanceof Error){
                return Result.fail<Sectors>(error.message);
            }
            return Result.fail<Sectors>("Erro desconhecido ao buscar por ID")
        }
    }
}