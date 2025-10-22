// src/userCases/membership/ListMembershipsUseCase.ts
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Membership } from "../../domain/entities/Membership";

export interface ListMembershipsByProjectRequest {
    projectId: string;
}

export class ListMembershipsByProjectUseCase {
    constructor(private membershipRepository: IMembershipRepository) {}

    async execute(request: ListMembershipsByProjectRequest): Promise<Membership[]> {
        return this.membershipRepository.listByProject(request.projectId);
    }
}
