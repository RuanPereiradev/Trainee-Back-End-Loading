import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";

interface UpdateSetorRequest{
    id: number;
    name: string;
    description: string;
}

export class UpdateSetorUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(request: UpdateSetorRequest): Promise<Result<Sectors>>{
        try {
            const sectorResult = await this.sectorRepository.findById(request.id);

            if(sectorResult.isFailure){
                return Result.fail<Sectors>("Sector não encontrado");
            }

            const existingSector = sectorResult.getValue();

            existingSector.changeName(request.name);
            existingSector.changeDescription(request.description);

            const result = await this.sectorRepository.update(existingSector);
            return result;
        } catch (error: any) {
            return Result.fail<Sectors>(error.message);
        }
    }
}