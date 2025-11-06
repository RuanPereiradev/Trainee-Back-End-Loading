import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
interface DeleteUserRequest{
    id: string
}

export class DeleteUserUseCase{
    constructor (private userRepository: IUserRepository){}

    async execute(request: DeleteUserRequest): Promise<Result<void>>{
        try{
            const userResult = await this.userRepository.findById(request.id);

            if(!userResult){
                return Result.fail<void>("Usuário não encontrado");
            }

            const existingUser = userResult.getValue();
            await this.userRepository.hardDelete(existingUser.id);
            return Result.ok<void>();

        }catch(error: any){
            return Result.fail<void>(error.message);

        }
    }

}