import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";

export interface IUserRepository{
    findById(id: string): Promise<Result<User>>;
    findByEmail(email: string): Promise<Result<User>>;
    findAll(): Promise<Result<User[]>>;
    save(user: User): Promise<Result<User>>;
    update(user:User): Promise<Result<User>>;
    hardDelete(id: string): Promise<Result<void>>;
}