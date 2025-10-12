import { promises } from "dns";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Result } from "../../env/Result";

export class UserRepository implements IUserRepository{
    private users: User[] = [];

    async save(user: User): Promise<Result<User>>{
        this.users.push(user);
        return Result.ok<User>(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find((u)=> u.id === id);
        return user|| null;
    }

   async findByEmail(email: string): Promise<Result<User>> {
        const user = this.users.find((u) => u.email.value === email);
    if(!user){
        return Result.fail<User>("Usuário nao encontrado");
    }
    return Result.ok<User>(user);
    }

    async findAll(): Promise<Result<User[]>> {
        if(this.users.length === 0){
            return Result.fail<User[]>("Nenhum usuário encontrado");
        }
        return Result.ok<User[]>(this.users);
    }

    async update(user: User): Promise<Result<User>> {
        const index = this.users.findIndex((u)=> u.id === user.id);

        if(index === -1){
            return Result.fail<User>("Usuário não encontrado")
        }
        this.users[index] = user;
        return Result.ok<User>(user);
    }

    async delete(id: string): Promise<Result<void>> {    
        const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return Result.fail<void>("Usuário não encontrado");
    }

    this.users.splice(index, 1);
    return Result.ok<void>();
    }
}
