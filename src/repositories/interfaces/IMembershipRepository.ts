import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";

export interface IMembershipRepository {
    create(membership: Membership): Promise<Result<Membership>>;
    findById(id: string): Promise<Membership | null>;
    findByUserAndProject(userId: string, projectId: string): Promise<Membership | null>;
    save(membership: Membership): Promise<void>;
    listByProject(projectId: string): Promise<Membership[]>;
    listByUser(userId: string): Promise<Membership[]>;
}
