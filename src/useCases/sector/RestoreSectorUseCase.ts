import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";

interface RestoreSectorRequest{
    id: number;
}

export class RestoreSectorUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(request: RestoreSectorRequest): Promise<Result<void>>{
        try {
           const sectorResult = await this.sectorRepository.findByIdAny(request.id);
           if(sectorResult.isFailure){
            return Result.fail<void>("setor nao encontrado")
           } 
           const sector = sectorResult.getValue();

           if(sector.deletedAt === null){
            return Result.fail<void>("o usuário está ativo")
           }
           return this.sectorRepository.restore(request.id);
        } catch (error: any) {
            return Result.fail<void>("Erro interno ao restaurar")
        }
    }
}