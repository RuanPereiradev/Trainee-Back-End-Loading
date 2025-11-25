import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface UpdateSelfRequest{
    id: string;
    name?: string;
    email?: string;
    password?: string;
}

export class UpdateSelfUseCase{
    constructor(private userRepository :IUserRepository){}

    async execute(request: UpdateSelfRequest): Promise<Result<User>>{
        try {
            const userResult = await this.userRepository.findById(request.id);

            if(userResult.isFailure){
                return Result.fail<User>("Usuário não encontrado")
            }

            const user = userResult.getValue();

            if(request.name){
            const nameChange = user.changeName(request.name);

            if(nameChange.isFailure)
                 return Result.fail(nameChange.getError());
            }

            if(request.email){
                const emailChange = user.changeEmail(new Email(request.email));
                if(emailChange.isFailure)
                    return Result.fail(emailChange.getError());
            } 
             
            if(request.password){
                const passwordChange = user.changePassword(new Password(request.password));
                if(passwordChange.isFailure) 
                    return Result.fail(passwordChange.getError())
            }

            return await this.userRepository.update(user);

        } catch (error: any) {
            return Result.fail<User>(error.message);
        }
    }
}