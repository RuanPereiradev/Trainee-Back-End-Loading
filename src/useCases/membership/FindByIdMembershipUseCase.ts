import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Membership } from "../../domain/entities/Membership";

interface FindByIdMembershipRequest{
    id: string;
} 

export class FindByIdMembershipUseCase{
    constructor(private membershipRepository: IMembershipRepository){}

    async execute(request: FindByIdMembershipRequest): Promise<Result<Membership>>{
        try{
            const membershipResult  = await this.membershipRepository.findById(request.id);

            if(membershipResult.isFailure){
                return Result.fail<Membership>(membershipResult.getError());
            }

            const membership = membershipResult.getValue();
             
            return Result.ok<Membership>(membership!);

        }catch(error){

            if(error instanceof Error){
                return Result.fail<Membership>(error.message);
            }

            return Result.fail<Membership>("Erro desconhecido ao buscar por ID")
        }
    }
}