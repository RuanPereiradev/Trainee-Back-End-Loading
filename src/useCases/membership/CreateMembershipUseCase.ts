// src/userCases/membership/CreateMembershipUseCase.ts
import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface CreateMembershipRequest {
    userId: string;
    projectId: string;
}

export class CreateMembershipUseCase {
    constructor(
        private membershipRepository: IMembershipRepository,
        private projectRepository: IProjectRepository,
        private userRepository: IUserRepository
    ) {}

    async execute(request: CreateMembershipRequest): Promise<Result<Membership>> {
        try {
            const { userId, projectId } = request;

            if (!userId || !projectId) {
                return Result.fail<Membership>("userId e projectId são obrigatórios");
            }

            const userResult = await this.userRepository.findById(userId);

            if (userResult.isFailure || !userResult.getValue()) {
                return Result.fail<Membership>("Usuário não encontrado");
            }

            const user = userResult.getValue();

            const projectResult = await this.projectRepository.findById(projectId);

            if (projectResult.isFailure || !projectResult.getValue()) {
                return Result.fail<Membership>("Projeto não encontrado");
            }

            const project = projectResult.getValue();

            const existingMembershipResult =
                await this.membershipRepository.findByUserAndProject(userId, projectId);

            const existingMembership = existingMembershipResult.getValue(); // pode ser null

            if (existingMembership) {
                return Result.fail<Membership>("Usuário já participa do projeto");
            }

            const membership = new Membership(user, project);

            const saveResult = await this.membershipRepository.create(membership);

            if (saveResult.isFailure) {
                return Result.fail<Membership>("Erro ao salvar membership");
            }

            return Result.ok<Membership>(saveResult.getValue());

        } catch (error: any) {
            return Result.fail<Membership>(error.message);
        }
    }
}
