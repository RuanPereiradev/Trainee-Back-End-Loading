import { MemoryMeasurement } from "vm";
import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../interfaces/IMembershipRepository";

export class MembershipRepository implements IMembershipRepository{
    
    private membership: Membership[] = [];

    async save(membership: Membership): Promise<Result<Membership>>{

        const exists = this.membership.find(m => m.id === membership.id);

        if(exists){
            return Result.fail<Membership>("Membership já existe");
        }

        this.membership.push(membership);
        return Result.ok<Membership>(membership);

    }

    async findById(id: string): Promise<Result<Membership>> {

        const membership = this.membership.find(m => m.id === id);

        if(!membership){
            return Result.fail<Membership>("Membership não encontrada")
        }
        return Result.ok<Membership>(membership);
    }

    async findAll(): Promise<Result<Membership[]>> {
        return Result.ok<Membership[]>(this.membership);
    }

    async update(membership: Membership): Promise<Result<Membership>> {

        const index = this.membership.findIndex(m => m.id === membership.id);

        if(index === -1){
            return Result.fail<Membership>("Membership não encontrada");
        }

        this.membership[index] = membership;
        return Result.ok<Membership>(membership);

    }

    async delete(id: string): Promise<Result<void>> {

        const index = this.membership.findIndex(m => m.id === id);

        if(index === -1){
            return Result.fail<void>("Membership nao encontrada")
        }

        this.membership.splice(index, 1)
        return Result.ok<void>();

    }
}