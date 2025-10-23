// src/userCases/membership/CreateMembershipUseCase.ts
import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
import { User } from "../../domain/entities/User";
import { Project } from "../../domain/entities/Projects";

export interface CreateMembershipRequest {
    user: User;
    project: Project;
}

export class CreateMembershipUseCase {
    constructor(private membershipRepository: IMembershipRepository) {}

    async execute(request: CreateMembershipRequest): Promise<Result<Membership>> {
        const { user, project } = request;

        const existing = await this.membershipRepository.findByUserAndProject(user.id, project.id);
        if(existing){
            return Result.fail("Usuário já participa deste projeto");
        }

        const membership = new Membership(user, project);
        await this.membershipRepository.create(membership);
        return Result.ok(membership);
    }
}
