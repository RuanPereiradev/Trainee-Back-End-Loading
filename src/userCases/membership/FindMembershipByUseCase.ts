import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";

export class FindMembershipsByUserUseCase {
    constructor(private membershipRepo: IMembershipRepository) {}

    async execute(userId: string): Promise<Result<Membership[]>> {
        try {
            const membershipsResult = await this.membershipRepo.findByUserId(userId);

            if (membershipsResult.isFailure) {
                return Result.fail<Membership[]>(membershipsResult.getError());
            }

            const memberships = membershipsResult.getValue();

            return Result.ok<Membership[]>(memberships);
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<Membership[]>(error.message);
            }

            return Result.fail<Membership[]>("Erro desconhecido ao listar memberships do usuário");
        }
    }
}
