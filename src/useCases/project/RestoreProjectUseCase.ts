import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";

interface RestoreProjectRequest{
    id: string;
}

export class RestoreProjectUseCase{
    constructor(private projectRepository: IProjectRepository){}

    async execute(request: RestoreProjectRequest): Promise<Result<void>>{
        try {
            const projectResult = await this.projectRepository.findByIdAny(request.id);
            if(projectResult.isFailure){
                return Result.fail<void>("Projeto não encontrado");
            }
            const project = projectResult.getValue();

            if(project.deletedAt === null){
                return Result.fail<void>("Projeto ativo")
            }

            return this.projectRepository.restore(request.id);
        } catch (error: any) {
            return Result.fail<void>("Erro interno ao restaurar")
        }
    }
}