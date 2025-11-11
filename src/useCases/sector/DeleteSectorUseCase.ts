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

            if(!sectorResult){
                return Result.fail<void>("Setor nao encontrado")
            }

            const existingSector = sectorResult.getValue();
            await this.sectorRepository.delete(existingSector.id!);
            return Result.ok<void>();

        } catch (error: any) {
            return Result.fail<void>(error.message);
        }
    }
}