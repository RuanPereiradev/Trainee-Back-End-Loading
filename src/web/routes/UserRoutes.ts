import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";
import z from "zod";
import { FastifyTypedInstance } from "../../config/swagger/FastifyTypedInstance";

export async function userRoutes(app: FastifyTypedInstance) {
  const userController = new UserController();
app.post(
    "/users",
    {
      schema:{
        tags:['users'],
        description:'Create a new user',
        body: z.object({
          name: z. string().min(1).describe("Nome do usuário"),
          email: z.email().describe("Email do usuário"),
          password: z.string().min(6).describe("senha do usuário"),
          role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).describe("Role: DIRECTOR, COORDENADOR, MEMBRO")
        }),
      },
      preHandler: [authMiddleware, requireDirector],
    },
    (request, reply) => userController.createUser(request, reply)
  );

  app.post("/login/auth", (request, reply) => userController.userLogin(request, reply));
  app.get("/users",{preHandler: [authMiddleware, requireDirector,]}, (request, reply) => userController.findAll(request, reply));
  app.get("/users/pagination",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.listPagineted(request, reply));
  app.get("/users/:id",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.findById(request, reply));
  app.put("/user/me", {preHandler: [authMiddleware]}, (request, reply) => userController.updateSelf(request,reply));
  app.put("/users/:id",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.updateUser(request, reply));
  app.delete("/users/:id",{preHandler: [authMiddleware, requireDirector]},  (request, reply) => userController.softDelete(request, reply));
  app.patch("/users/:id/restore", {preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.restore(request, reply));

}
