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
            const existingUser = await this.userRepository.findById(request.id);

            if(!existingUser){
                return Result.fail<void>("Usuário não encontrado");
            }
            await this.userRepository.delete(existingUser.id);
            return Result.ok<void>();

        }catch(error: any){
            return Result.fail<void>(error.message);

        }
    }

}