"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./value-objects/Email");
const Password_1 = require("./value-objects/Password");
const RoleType_1 = require("./enums/RoleType");
const UserRole_1 = require("./enums/UserRole");
const User_1 = require("./entities/User");
const email = new Email_1.Email("ruanpereira@top");
const password = new Password_1.Password("Senha12345676543");
const role = new UserRole_1.UserRole(RoleType_1.RoleType.DIRETOR);
const user = new User_1.User("Ruan Pereira", email, password, role);
console.log("Usuário criado com sucesso: ");
console.log(user);
user.changeName("Ruan P.");
console.log("Novo nome:", user.name);
user.desactivate();
console.log("Ativo? ", user.isActive);
//# sourceMappingURL=UserTest.js.map