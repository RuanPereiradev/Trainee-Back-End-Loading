import { promises } from "dns";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Result } from "../../env/Result";
import { PrismaClient } from "@prisma/client";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { RoleType } from "../../domain/enums/RoleType";
import { UserRole } from "../../domain/enums/UserRole";
const prisma = new PrismaClient();

export class UserRepository implements IUserRepository{

    async save(user: User): Promise<Result<User>>{
        const created = await prisma.user.create({
            data:{
                id: user.id,
                name: user.name,
                email: user.email.value,
                role: user.role
            }
        });
        return Result.ok<User>(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where:{id} });
        if(!user) return null;

        return new User(
            user.name,
            new Email(user.email),
            new Password(user.password),
            user.role as UserRole
        );
    }

    async findByEmail(email: string): Promise<Result<User>> {
        const user = await prisma.user.findUnique({where: { email } });

        if(!user)
        return Result.fail<User>("Usuário nao encontrado");
    
        return Result.ok<User>(
        new User(
            user.name,
            new Email(user.email),
            new Password(user.password),
            user.role as UserRole
        )
    );
}

    
 async findAll(): Promise<Result<User[]>> {
    const users = await prisma.user.findMany();
    if (users.length === 0) return Result.fail<User[]>("Nenhum usuário encontrado");

    const userEntities = users.map((u: PrismaClient) =>
        new User(u.name, new Email(u.email), new Password(u.password), u.role as UserRole)
    );

    return Result.ok<User[]>(userEntities);
}

    async update(user: User): Promise<Result<User>> {
       const update = await prisma.user.update({
        data:{
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        }
    });
    return Result.ok<User>(user);
}

    async delete(id: string): Promise<Result<void>> {    
        await prisma.user.delete( {where: {id}} )
        return Result.ok<void>();
    }

}
