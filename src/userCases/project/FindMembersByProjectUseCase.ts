import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface FindMembersByProjectRequest {
  projectId: string;
}

export class FindMembersByProjectUseCase {
  constructor(private membershipRepo: IMembershipRepository) {}

  async execute(request: FindMembersByProjectRequest): Promise<Result<Membership[]>> {
    try {
      const { projectId } = request;

      if (!projectId) {
        return Result.fail<Membership[]>("ID do projeto é obrigatório");
      }

      const allMembershipsResult = await this.membershipRepo.findAll();
      if (allMembershipsResult.isFailure) {
        return Result.fail<Membership[]>(allMembershipsResult.getError());
      }

      const allMemberships = allMembershipsResult.getValue();

      const projectMembers = allMemberships.filter(
        (m) => m.project.id === projectId && !m.leftAt
      );

      return Result.ok<Membership[]>(projectMembers);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<Membership[]>(error.message);
      }
      return Result.fail<Membership[]>("Erro desconhecido ao buscar membros do projeto");
    }
  }
}
