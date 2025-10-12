import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";

export interface IMembershipRepository{
    findById(id: string): Promise<Result<Membership>>;
    findAll(): Promise<Result<Membership[]>>;
    save(membership: Membership): Promise<Result<Membership>>;
    delete(id: string): Promise<Result<void>>;
    update(membership: Membership): Promise<Result<Membership>>;

}