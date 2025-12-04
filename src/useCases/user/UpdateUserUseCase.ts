import { Password } from "../../domain/value-objects/Password";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";
import { asyncWrapProviders } from "async_hooks";
import { RoleType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { email } from "zod";

interface UpdateUserRequest{
    id: string;
    name?: string;
    email?: string;
    password?:string;
    role?: RoleType;
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

            if(request.name){
                const nameResult =  existingUser.changeName(request.name);
                if(nameResult.isFailure){
                    return Result.fail(nameResult.getError())
                }
            }
            if(request.email){
                const emailResult = existingUser.changeEmail(new Email(request.email));
                if(emailResult.isFailure){
                    return Result.fail(emailResult.getError())
                }
            }
            if(request.password){
                const hashedPassword = await bcrypt.hash(request.password, 10)
                const passwordResult = existingUser.changePassword(new Password(hashedPassword))
                if(passwordResult.isFailure){
                    return Result.fail(passwordResult.getError())
                }
            }
            if(request.role){
                const roleResult = existingUser.changeRole(request.role)
                if(roleResult.isFailure){
                    return Result.fail(roleResult.getError())
                }
            }

            const result = await this.userRepository.update(existingUser)
            return result;
            
        }catch(error: any){
            return Result.fail<User>(error.message);
        }
    }
}