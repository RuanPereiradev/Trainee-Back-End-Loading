import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";
import z, { email } from "zod";
import { FastifyTypedInstance } from "../../config/swagger/FastifyTypedInstance";

export async function userRoutes(app: FastifyTypedInstance) {
  const userController = new UserController();
app.post("/users",
    {
      schema:{
        tags:['Users'],
        description:'Create a new user',
        body: z.object({
          name: z.string().min(1).describe("Nome do usuário"),
          email: z.email().describe("Email do usuário"),
          password: z.string().min(6).describe("senha do usuário"),
          role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).describe("Role: DIRECTOR, COORDENADOR, MEMBRO")
        }),
      },
      preHandler: [authMiddleware, requireDirector],
    },
  (request, reply) => userController.createUser(request, reply));

app.post("/login/auth",
    {
      schema:{
        tags:["Users"], 
        description:'Login User', 
        body: z.object({
          email: z.email().describe("email do usuario"),
          password: z.string().min(6).describe("Senha do usuário")
        })
      },
    },
 (request, reply) => userController.userLogin(request, reply));

  app.get("/users",
    {
      schema:{
        tags:['Users'],
        description: 'Get Users',
      },
      preHandler: [authMiddleware, requireDirector]
    },
  (request, reply) => userController.findAll(request, reply));

  app.get("/users/pagination",
    {
      schema:{
        tags:['Users'],
        description: 'Get Pagination Users',
      },
      preHandler: [authMiddleware, requireDirector]
    },
  (request, reply) => userController.listPagineted(request, reply));

  app.get("/users/:id",
    {
      schema:{
        tags:['Users'],
        description: 'Get Users',
      },
      preHandler: [authMiddleware, requireDirector]
    },
  (request, reply) => userController.findById(request, reply));

  app.put("/user/me",
    {
      schema:{
        tags:['Users'],
        description:'Edit-Me',
        body: z.object({
          name: z.string().min(1).describe("Nome do usuário"),
          email: z.email().describe("Email do usuário"),
          password: z.string().min(6).describe("senha do usuário"),
          role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).describe("Role: DIRECTOR, COORDENADOR, MEMBRO")
        }),
      },
      preHandler: [authMiddleware]
    }, 
  (request, reply) => userController.updateSelf(request,reply));

  app.put("/users/:id",
    {
      schema:{
        tags:['Users'],
        description:'Edit user',
        body: z.object({
          name: z.string().min(1).describe("Nome do usuário"),
          email: z.email().describe("Email do usuário"),
          password: z.string().min(6).describe("senha do usuário"),
          role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).describe("Role: DIRECTOR, COORDENADOR, MEMBRO")
        }),
      },
      preHandler: [authMiddleware, requireDirector],
    },
  (request, reply) => userController.updateUser(request, reply));

  app.delete("/users/:id",
    {
      schema:{
        tags:['Users'],
        description: 'Delete Users',
      },
      preHandler: [authMiddleware, requireDirector]
    },
  (request, reply) => userController.softDelete(request, reply));

  app.patch("/users/:id/restore",
    {
      schema:{
        tags:['Users'],
        description: 'Restore Users',
      },
      preHandler: [authMiddleware, requireDirector]
    },
  (request, reply) => userController.restore(request, reply));

}
