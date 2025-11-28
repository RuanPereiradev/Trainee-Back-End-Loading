import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface UserEditProfileRequest{
    userId: string;
    userIdForEdit: string;
    name?: string;
    email?: string;
    password?: string;
}

export class UserEditProfileUseCase{
    constructor(
        private userRepository: IUserRepository,
    ){}

    async execute(request: UserEditProfileRequest): Promise<Result<User>>{
        try {

            if(request.userId !== request.userIdForEdit){
                return Result.fail<User>("Não é possivel outro usuário")
            }
            
            //verificação do usuário
            const userResult = await this.userRepository.findById(request.userIdForEdit);
            if(userResult.isFailure || !userResult.getValue()){
                return Result.fail("User não encontrado")
            }

            const user = userResult.getValue();

            if(request.name){
            user.changeName(request.name);
            }
            if(request.email){
            user.changeEmail(new Email(request.email));
            }
            if(request.password){
            user.changePassword(new Password(request.password));
            }

            const result = await this.userRepository.update(user)
            return result
        } catch (error:any) {
            return Result.fail<User>(error.message)
        }
        
    }
}