// import { UserRepository } from "../../repositories/prisma/UserRepository";
// import { CreateUserUseCase } from "../../useCases/user/CreateUserUseCase";
// import { RoleType } from "../enums/RoleType";
// import { UserRole } from "../enums/UserRole";

// async function testCreateUser() {
//     const userRepo = new UserRepository();
//     const createUser = new CreateUserUseCase(userRepo);

//     const result = await createUser.execute({
//         name: "Ruan",
//         email: "ruan@rteste.com",
//         password: "Senha134",
//         role: new UserRole(RoleType.COORDENADOR)
//     });

//     if(result.isSuccess){
//         console.log("Usuário criado:", result.getValue().name);
//     }else{
//         console.log("Erro ao criar usuário:", result.getError());
//     }
// }
// testCreateUser();