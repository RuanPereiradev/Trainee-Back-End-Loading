import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface ListUserPaginationRequest{
    page: number,
    pageSize: number,
}

export class ListUserPaginatedUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: ListUserPaginationRequest): Promise<Result<any>>{
        try {
            const result = await this.userRepository.listPaginated(request.page, request.pageSize)

            return Result.ok(result)
        } catch (error: any) {
            return Result.fail(error.message)
        }
    }
}