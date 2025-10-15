import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";

export class FindAllProjectUseCase {
  constructor(private projectRepo: IProjectRepository) {}

  async execute(): Promise<Result<Project[]>> {
    try {
      const projectsResult = await this.projectRepo.findAll();

      if (projectsResult.isFailure) {
        return Result.fail<Project[]>(projectsResult.getError());
      }

      const projects = projectsResult.getValue();

      if (projects.length === 0) {
        return Result.fail<Project[]>("Nenhum projeto encontrado");
      }

      return Result.ok<Project[]>(projects);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<Project[]>(error.message);
      }
      return Result.fail<Project[]>("Erro desconhecido ao buscar projetos");
    }
  }
}
