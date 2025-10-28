// src/repositories/InMemoryMembershipRepository.ts
import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
export class MembershipRepository implements IMembershipRepository {
    
    private memberships: Membership[] = [];

    async create(membership: Membership): Promise<Result<Membership>> {
        this.memberships.push(membership);
        return Result.ok(membership);
    }

    async findById(id: string): Promise<Membership | null> {
        return this.memberships.find(m => m.id === id) ?? null;
    }

    async findByUserAndProject(userId: string, projectId: string): Promise<Membership | null> {
        return this.memberships.find(
            m => m.user.id === userId && m.project.id === projectId && !m.leftAt
        ) ?? null;
    }

    async save(membership: Membership): Promise<void> {
        const index = this.memberships.findIndex(m => m.id === membership.id);
        if(index !== -1) this.memberships[index] = membership;
    }

    async listByProject(projectId: string): Promise<Membership[]> {
        return this.memberships.filter(m => m.project.id === projectId && !m.leftAt);
    }

    async listByUser(userId: string): Promise<Membership[]> {
        return this.memberships.filter(m => m.user.id === userId && !m.leftAt);
    }
}
