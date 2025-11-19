import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";

interface ListProjectsPaginationRequest{
    page: number,
    pageSize: number
}

export class ListProjectsPaginatedUseCase{
    constructor(private projectRepository: IProjectRepository){}

    async execute(request: ListProjectsPaginationRequest): Promise<Result<any>>{
        try {
            const result = await this.projectRepository.listPaginated(request.page, request.pageSize);

            return Result.ok(result)
        } catch (error: any) {
            return Result.fail(error.message)
        }
    }
}