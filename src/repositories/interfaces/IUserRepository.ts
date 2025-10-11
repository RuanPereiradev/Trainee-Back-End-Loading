import { User } from "../../domain/entities/User";
import { Result } from "../../env/Result";

export interface IUserRepository{
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<Result<User>>;
    findtAll(): Promise<Result<User[]>>;
    save(user: User): Promise<Result<User>>;
    update(user:User): Promise<User>;
    delete(id: string): Promise<void>;
}