import { UserRole } from "../../domain/enums/UserRole";
import { Password } from "../../domain/value-objects/Password";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { asyncWrapProviders } from "async_hooks";

interface UpdateUserRequest{
    id: string;
    name: string;
    email: string;
    password:string;
    role: UserRole;
}

export class UpdateUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: UpdateUserRequest): Promise<Result<User>>{
        try{
            const existingUser = await this.userRepository.findById(request.id);

            if(!existingUser){
                return Result.fail<User>("Usuário não encontrado");
            }

            existingUser.changeName(request.name);
            existingUser.changeRole(request.role);
            existingUser.changeEmail(new Email(request.email));
            existingUser.changePassword(new Password(request.password));

            const result = await this.userRepository.update(existingUser)
            return result;
            
        }catch(error: any){
            return Result.fail<User>(error.message);
        }
    }
}