import { PrismaClient, Prisma } from "@prisma/client";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Result } from "../../env/Result";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";


const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
 

// async  findByProjectId(projectId: string): Promise<Result<User[]>> {
//     try {
//       const found = await prisma.user.findMany({
//         where:{projectId},
//         include: {user:true}
//       })
//     } catch (error) {
      
//     }
//   }
 
   // Criação de usuário
  async save(user: User): Promise<Result<User>> {
    try{
      const created = await prisma.user.create({
        data:{
          id: user.id,
          name: user.name,
          email: user.email.value,
          password: user.password.value,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
      const newUser = new User(
        created.name,
        new Email(created.email),
        new Password(created.password),
        created.role,
        created.id
      );
      
      return Result.ok<User>(newUser);
    }catch(error: any){
      return Result.fail<User>(error.message)
    }
  }

  //buscar por id
  async findById(id: string): Promise<Result<User>> {
      try{
        const found = await prisma.user.findFirst({ 
          where: {id}
         });
         if(!found){
          return Result.fail<User>("User not found or user deleted")
         }
         if(found.deletedAt !==null ){
            return Result.fail<User>("user deleted")
         }
         const user = new User(
          found.name,
          new Email(found.email),
          new Password(found.password),
          found.role,
          found.id,
         );
         return Result.ok<User>(user);
      }catch(error: any){
        return Result.fail<User>(error.message);
      }
    }

  async findByIdAny(id: string): Promise<Result<User>> {
    try {
      const found = await prisma.user.findUnique({
        where:{id}
      });
      if(!found){
        return Result.fail<User>("User not found")
      }
        const user = new User(
          found.name,
          new Email(found.email),
          new Password(found.password),
          found.role,
          found.id,
         );   
         if(found.deletedAt){
          user.softDelete();
         (user as any)._deletedAt = found.deletedAt;
         }
         return Result.ok<User>(user);

        } catch (error: any) {
          return Result.fail<User>(error.message)
      }
    }

    //buscar todos
   async findAll(): Promise<Result<User[]>> {
    try{
      const users = await prisma.user.findMany({
      });

      const userEntity = users.map(
        (u) =>
          new User(
          u.name,
            new Email(u.email),
            new Password(u.password),
            u.role,
            u.id
          )
      );
      
      return Result.ok<User[]>(userEntity);
    }catch(error: any){
      return Result.fail<User[]>(error.message);
    }
  }
 
  // 🔍 Busca por e-mail
  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const found = await prisma.user.findFirst({
        where:{ email, deletedAt: null},
      });
      if(!found){
        return Result.fail<User>("User not found");
      }

      const user = new User(
        found.name,
        new Email(found.email),
        new Password(found.password),
        found.role
      );
      return Result.ok<User>(user);
    }catch(error:any){
      return Result.fail<User>(error.message);
    }
}
  // ✏️ Atualização
  async update(user: User): Promise<Result<User>> {
    try{
      const update =  await prisma.user.update({
        where: {id: user.id},
        data: {
          name: user.name,
          email: user.email.value,
          password: user.password.value,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
      const userEntity = new User(
        update.name,
        new Email(update.email),
        new Password(update.password),
        update.role
      );

      return Result.ok<User>(userEntity)
    }catch(error: any){
      return Result.fail<User>(error.message);
    }
  } 

  async softDelete(id: string): Promise<Result<void>> {
    try{
      await prisma.user.update({where:{id}, data:{deletedAt: new Date()}
    });
      return Result.ok<void>();

    }catch(error: any){
      return Result.fail<void>(error.message);
    }
  }

   async restore(id: string): Promise<Result<void>> {
    try {
      await prisma.user.update({
        where: {id}, data: {deletedAt: null}
      });
      return Result.ok<void>()
    } catch (error: any) {
      return Result.fail<void>(error.message)
    }
  }


}
