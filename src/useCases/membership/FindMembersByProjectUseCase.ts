import { Membership } from "../../domain/entities/Membership";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface FindMembersByProjectRequest {
  projectId: string;
}

export class FindMembersByProjectUseCase {
  constructor(private membershipRepo: IMembershipRepository
    
  ) {}

  async execute(request: FindMembersByProjectRequest): Promise<Result<User[]>> {
    try {
      const { projectId } = request;

      if (!projectId) {
        return Result.fail<User[]>("ID do projeto é obrigatório");
      }

      const allMembershipsResult = await this.membershipRepo.listByProject(projectId);
      if (allMembershipsResult.isFailure) {
        return Result.fail<User[]>(allMembershipsResult.getError());
      }

      const allMemberships = allMembershipsResult.getValue();

      const users = allMemberships.map(m => m.user);

      return Result.ok<User[]>(users);

    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<User[]>(error.message);
      }
      return Result.fail<User[]>("Erro desconhecido ao buscar membros do projeto");
    }
  }
}
