import { Result } from "../../env/Result";
import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface UpdateMembershipRequest {
  id: string;
  rejoin?: boolean; // se true, o membro volta ao projeto
  leave?: boolean;  // se true, o membro sai do projeto
}

export class UpdateMembershipUseCase {
  constructor(private membershipRepo: IMembershipRepository) {}

  async execute(request: UpdateMembershipRequest): Promise<Result<Membership>> {
    try {
      const { id, rejoin, leave } = request;

      const membershipResult = await this.membershipRepo.findById(id);
      if (membershipResult.isFailure) {
        return Result.fail<Membership>(membershipResult.getError());
      }

      const membership = membershipResult.getValue();

      if (leave) {
        membership.leaveProject();
      }

      if (rejoin) {
        membership.rejoinProject();
      }

      const updateResult = await this.membershipRepo.update(membership);
      if (updateResult.isFailure) {
        return Result.fail<Membership>(updateResult.getError());
      }

      return Result.ok<Membership>(updateResult.getValue());
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail<Membership>(error.message);
      }
      return Result.fail<Membership>("Erro desconhecido ao atualizar membership");
    }
  }
}
