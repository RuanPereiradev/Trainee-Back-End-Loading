import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface RestoreUserRequest {
    id: string;
}

export class RestoreUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: RestoreUserRequest): Promise<Result<void>>{
        try {
            const userResult = await this.userRepository.findByIdAny(request.id);
            if(userResult.isFailure){
                return Result.fail<void>("Usuário não encontrado")
            }
            const user = userResult.getValue();

            if(user.deletedAt === null){
                return Result.fail<void>("o usuário está ativo")
            }

            return  this.userRepository.restore(request.id);
        } catch (error: any) {
            return Result.fail<void>("Erro interno ao restaurar")
        }
    }
}