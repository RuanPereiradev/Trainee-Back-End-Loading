import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
interface FindUserByIdRequest{
    id: string;
}

export class FindUserByIdUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: FindUserByIdRequest): Promise<Result<User>>{
        try{
            const user = await this.userRepository.findById(request.id);

            if(!user){
                return Result.fail<User>("Usuário não encontrado");
            }

            return Result.ok<User>();

        }catch (error){

            if(error instanceof Error){
                return Result.fail<User>(error.message);
            }
            
            return Result.fail<User>("Erro desconhecido ao buscar por ID")
        }
    }
}