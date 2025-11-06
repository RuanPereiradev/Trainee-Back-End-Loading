import { Password } from "../../domain/value-objects/Password";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { asyncWrapProviders } from "async_hooks";
import { RoleType } from "@prisma/client";

interface UpdateUserRequest{
    id: string;
    name: string;
    email: string;
    password:string;
    role: RoleType;
}

export class UpdateUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: UpdateUserRequest): Promise<Result<User>>{
        try{
            const userResult = await this.userRepository.findById(request.id);

            if(userResult.isFailure){
                return Result.fail<User>("Usuário não encontrado");
            }

            const existingUser = userResult.getValue();        

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