// src/userCases/membership/LeaveProjectUseCase.ts
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Result } from "../../env/Result";

export interface LeaveProjectRequest {
    membershipId: string;
}

export class LeaveProjectUseCase {
    constructor(private membershipRepository: IMembershipRepository) {}

    async execute(request: LeaveProjectRequest): Promise<Result<void>> {
        const { membershipId } = request;
        const membership = await this.membershipRepository.findById(membershipId);
        if(!membership) return Result.fail("Vínculo não encontrado");

        membership.leaveProject();
        await this.membershipRepository.save(membership);
        return Result.ok();
    }
}
