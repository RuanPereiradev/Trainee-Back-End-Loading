import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";

interface ListMembershipPaginationRequest{
    page: number,
    pageSize: number;
}

export class ListMembershipPaginationUseCase{
    constructor(private membershipRepository: IMembershipRepository){}

    async execute(request: ListMembershipPaginationRequest): Promise<Result<any>>{
        try {
            const result = await this.membershipRepository.listPaginated(request.page, request.pageSize)

            return Result.ok(result)
        } catch (error:any) {
           return Result.fail(error.message) 
        }
    }
}


