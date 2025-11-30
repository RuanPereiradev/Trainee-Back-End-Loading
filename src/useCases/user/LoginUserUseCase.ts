import { RoleType } from "@prisma/client";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { Result } from "../../env/Result";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
interface LoginUserRequest{
    email: string;
    password: string;
}

export class LoginUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(request: LoginUserRequest): Promise<Result<string>>{
        try {
           const userOrError = await this.userRepository.findByEmail(request.email);
            if(!userOrError ||userOrError.isFailure){
                return Result.fail("Invalid credentials");
            }

            const userResult = userOrError.getValue()

            if(userResult.deletedAt !== null){
                return Result.fail("User invalid")
            }
            const passwordMatch = await bcrypt.compare(request.password, userResult.password.value)
           
            if(!passwordMatch){
                return Result.fail("invalid credentials");
            }

            const token = jwt.sign(
                {
                    userId: userResult.id,
                    role: userResult.role
                },
                process.env.JWT_SECRET!,
                {expiresIn:"1d"}
            );
            return Result.ok(token);

        } catch (error:any) {
            return Result.fail(error.message);

        }
    }
}
