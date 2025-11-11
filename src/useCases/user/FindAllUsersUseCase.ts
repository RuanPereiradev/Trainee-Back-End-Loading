import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";

export class FindAllUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(): Promise<Result<User[]>>{
        try {
            const user = await this.userRepository.findAll();

            if(user.isFailure){
                return Result.fail<User[]>(user.getError())
            }

            const users = user.getValue();

             if (users.length === 0) {
                return Result.fail<User[]>("Nenhum usuário encontrado");
            }

            return Result.ok<User[]>(users);

                } catch (error) {
            if (error instanceof Error) {
                return Result.fail<User[]>(error.message);
            }
            return Result.fail<User[]>("Erro desconhecido");
        }
    }
}