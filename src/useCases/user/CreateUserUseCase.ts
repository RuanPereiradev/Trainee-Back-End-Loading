import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { Result } from "../../env/Result";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { RoleType } from "@prisma/client";
import bcrypt from "bcryptjs";

interface CreateUserRequest{
    name: string;
    email: string;
    password: string;
    role: RoleType;
}

export class CreateUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: CreateUserRequest): Promise<Result<User>>{
        try{
            const emailResult = await this.userRepository.findByEmail(request.email);
            if(emailResult.isSuccess){
                return Result.fail<User>("Email already in use");
            }
            
            //cria email e password
            const email = new Email(request.email);
            const hashedPassword = await bcrypt.hash(request.password, 10)
            const password = new Password(hashedPassword);

            const user = new User(request.name, email, password, request.role)

            const saved = await this.userRepository.save(user);

            return saved;
        }catch(error: any){
            return Result.fail<User>(error.message);
        }
    }
}