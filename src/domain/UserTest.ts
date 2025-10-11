import { PassThrough } from "stream";
import { Email } from "./value-objects/Email";
import { Password } from "./value-objects/Password";
import { RoleType } from "./enums/RoleType";
import { UserRole } from "./enums/UserRole";
import { User } from "./entities/User";

const email = new Email("ruanpereira@gmail.com")
const password = new Password("Senha12345676543")
const role = new UserRole(RoleType.DIRETOR);

const user = new User("Ruan Pereira", email, password, role)

console.log("Usuário criado com sucesso: ")
console.log(user)

user.changeName("Ruan P.");
console.log("Novo nome:",user.name);

// user.desactivate();
// console.log("Ativo? ", user.isActive)