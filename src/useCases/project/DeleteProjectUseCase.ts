import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { Project } from "../../domain/entities/Projects";

interface DeleteProjectRequest {
  id: string;
}

export class DeleteProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(request: DeleteProjectRequest): Promise<Result<void>> {
    try {
        
      const { id } = request;

      const projectResult = await this.projectRepo.findById(id);

      if (projectResult.isFailure || !projectResult.getValue()) {
        return Result.fail<void>(projectResult.getError());
      }

      const project = projectResult.getValue();

      
      const deleteResult = await this.projectRepo.softDelete(project.id);

      if (deleteResult.isFailure) {
        return Result.fail<void>(deleteResult.getError());
      }

      return Result.ok<void>();

    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<void>(error.message);
      }
      return Result.fail<void>("Erro desconhecido ao deletar projeto");
    }
  }
}
