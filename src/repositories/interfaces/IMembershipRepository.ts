import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { PaginationResult } from "../../web/Wrappers/Pagination";

export interface IMembershipRepository {
    create(membership: Membership): Promise<Result<Membership>>;
    findById(id: string): Promise<Result<Membership | null>>;
    findAll(): Promise<Result<Membership[]>>;
    update(membership: Membership): Promise<Result<Membership>>
    findByUserAndProject(userId: string, projectId: string): Promise<Result<Membership | null>>;
    listByProject(projectId: string): Promise<Result<Membership[]>>;
    listByUser(userId: string): Promise<Result<Membership[]>>;
    leaveProject(id: string): Promise<Result<Membership>>;
    listPaginated(page: number, pageSize:number): Promise<PaginationResult<Membership>>;
    findByDirectorProject(projectId: string): Promise<Result<Membership | null>>;
    findByCoordenadorProject(projectId: string): Promise<Result<Membership | null>>;
}
