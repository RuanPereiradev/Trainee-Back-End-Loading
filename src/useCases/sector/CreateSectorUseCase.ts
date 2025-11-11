import { Sectors } from "../../domain/entities/Sectors";
import { ISectorRepository } from "../../repositories/interfaces/ISectorRepository";
import { Result } from "../../env/Result";
import { Project } from "../../domain/entities/Projects";

interface CreateSectorRequest{
    id?: number,
    name: string,
    description?: string
}

export class CreateSectorUseCase{
    constructor(private sectorRepository: ISectorRepository){}

    async execute(request: CreateSectorRequest): Promise<Result<Sectors>>{
        try{
          const nameSector = await this.sectorRepository.findByName(request.name);
          if(nameSector.isSuccess && nameSector.getValue() !== null){
            return Result.fail<Sectors>("Name already in use");
          }

          const sector = new Sectors(request.name, request.description);

          const saved = await this.sectorRepository.save(sector);
          
          return saved;

        }catch(error: any){
            return Result.fail<Sectors>(error.message)
        }
    }
   
}


