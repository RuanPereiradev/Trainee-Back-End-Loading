import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { Project } from "../../domain/entities/Projects";

interface DeleteProjectRequest {
  id: string;
}

export class DeleteProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(request: DeleteProjectRequest): Promise<Result<Project>> {
    try {
        
      const { id } = request;

      const projectResult = await this.projectRepo.findById(id);

      if (projectResult.isFailure) {
        return Result.fail<Project>(projectResult.getError());
      }

      const project = projectResult.getValue();

      
      const deleteResult = await this.projectRepo.delete(id);

      if (deleteResult.isFailure) {
        return Result.fail<Project>(deleteResult.getError());
      }

      return Result.ok<Project>(project);

    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<Project>(error.message);
      }
      return Result.fail<Project>("Erro desconhecido ao deletar projeto");
    }
  }
}
