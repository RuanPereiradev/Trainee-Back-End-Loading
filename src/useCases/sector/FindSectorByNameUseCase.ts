import { Result } from "../../env/Result";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";
import { Sectors } from "../../domain/entities/Sectors";

interface FindSectorByNameRequest{
    name: string;
}

export class FindSectorByNameUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(request: FindSectorByNameRequest): Promise<Result<Sectors>>{
        try {
            const sector = await this.sectorRepository.findByName(request.name);

            if(!sector){
                return Result.fail<Sectors>("Setor não encontrado");
            }
            return Result.ok<Sectors>();

        } catch (error) {
            if(error instanceof Error){
                return Result.fail<Sectors>(error.message);
            }
            return Result.fail<Sectors>("Erro desconhecido ao buscar setor por nome")
        }
    }
}