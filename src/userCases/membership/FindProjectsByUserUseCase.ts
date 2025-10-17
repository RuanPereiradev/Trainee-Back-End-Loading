import { Membership } from "../../domain/entities/Membership";
import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

export class FindProjectsByUserUseCase {
    constructor(private membershipRepo: IMembershipRepository) {}

    async execute(id: string): Promise<Result<Project[]>> {
        try {
            const allMembershipsResult = await this.membershipRepo.findAll();
            if (allMembershipsResult.isFailure) {
                return Result.fail<Project[]>(allMembershipsResult.getError());
            }

            const projects = allMembershipsResult.getValue()
                .filter((m) => m.user.id === id && !m.leftAt)
                .map((m) => m.project);

            return Result.ok(projects);
            
        } catch (error) {
            if (error instanceof Error) {
                return Result.fail<Project[]>(error.message);
            }
            return Result.fail<Project[]>("Erro desconhecido ao listar projetos do usuário");
        }
    }
}
