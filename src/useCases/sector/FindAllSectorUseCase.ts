import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";

export class FindAllSectorUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(): Promise<Result<Sectors[]>>{
        try {
            const sectorResult = await this.sectorRepository.findAll();

            if(sectorResult.isFailure){
                return Result.fail<Sectors[]>(sectorResult.getError());
            }

            const sectors = sectorResult.getValue();

            if(sectors.length === 0){
                return Result.fail<Sectors[]>("Nenhum setor encontrado");
            }

            return Result.ok<Sectors[]>(sectors);
            
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<Sectors[]>(error.message);
        }
        return Result.fail<Sectors[]>("Erro desconhecido ao buscar projetos");
        }
    }
}