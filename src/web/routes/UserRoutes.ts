import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController();

  app.post("/users",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.createUser(request, reply));
  app.post("/login/auth", (request, reply) => userController.userLogin(request, reply));
  app.get("/users",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.findAll(request, reply));
  app.get("/users/pagination",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.listPagineted(request, reply));
  app.get("/users/:id",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.findById(request, reply));
  app.put("/user/me", {preHandler: [authMiddleware]}, (request, reply) => userController.updateSelf(request,reply));
  app.put("/users/:id",{preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.updateUser(request, reply));
  app.delete("/users/:id",{preHandler: [authMiddleware, requireDirector]},  (request, reply) => userController.softDelete(request, reply));
  app.patch("/users/:id/restore", {preHandler: [authMiddleware, requireDirector]}, (request, reply) => userController.restore(request, reply));

}
