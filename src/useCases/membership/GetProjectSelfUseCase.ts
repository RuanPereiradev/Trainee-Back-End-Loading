import { Membership } from "../../domain/entities/Membership";
import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface GetProjectSelfRequest{
    id: string;
}

export class GetProjectSelfUseCase{
    constructor(private membershipRepository: IMembershipRepository){}

    async execute(request: GetProjectSelfRequest): Promise<Result<Membership[]>>{
        try {

            const membershipResult = await this.membershipRepository.listByUser(request.id);

            if(membershipResult.isFailure){
                return Result.fail<Membership[]>(membershipResult.getError())
            }

            const membership = membershipResult.getValue();

            return Result.ok<Membership[]>(membership)

        } catch (error:any) {
            
            if(error instanceof Error){
                return Result.fail<Membership[]>(error.message);
            }

            return Result.fail<Membership[]>("Erro desconhecido ao buscar por ID")
        }
    }
}