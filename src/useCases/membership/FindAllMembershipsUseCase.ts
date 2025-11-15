import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
import { Membership } from "../../domain/entities/Membership";

export class FindAllMembershipUseCase{
    constructor (private membershipRepository: IMembershipRepository){}

    async execute(): Promise<Result<Membership[]>>{
        try {
            const membershipResult = await this.membershipRepository.findAll();
            if(membershipResult.isFailure){
                return Result.fail<Membership[]>(membershipResult.getError())
            }

            const memberships = membershipResult.getValue();

            if(memberships.length === 0){
                return Result.fail<Membership[]>("nenhum relacionamento encontrado")
            }

            return Result.ok<Membership[]>(memberships);
        } catch (error:any) {
            if(error instanceof Error){
                return Result.fail<Membership[]>(error.message);
            }
            return Result.fail<Membership[]>("Erro desconhecido ao buscar relacionamento")
        }
    }
}