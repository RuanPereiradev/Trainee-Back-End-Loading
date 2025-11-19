import { Result } from "../../env/Result";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";

interface DeleteSectorRequest{
    id: number
}

export class DeleteSectorUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(request: DeleteSectorRequest): Promise<Result<void>>{
        try {
            const sectorResult = await this.sectorRepository.findById(request.id);

            if(sectorResult.isFailure || !sectorResult.getValue()){
                return Result.fail<void>("Setor nao encontrado")
            }

            const existingSector = sectorResult.getValue();

            const deleteResult =  await this.sectorRepository.delete(existingSector.id!);

            if(deleteResult.isFailure){
                return Result.fail<void>(deleteResult.getError())
            }

            return Result.ok<void>();
        } catch (error: any) {
            return Result.fail<void>(error.message);
        }
    }
}