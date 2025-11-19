import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController();

  app.post("/users", (request, reply) => userController.createUser(request, reply));
  app.get("/users", (request, reply) => userController.findAll(request, reply));
  app.get("/users/:id", (request, reply) => userController.findById(request, reply));
  app.put("/users/:id", (request, reply) => userController.updateUser(request, reply));
  app.delete("/users/:id", (request, reply) => userController.softDelete(request, reply));
  app.patch("/users/:id/restore", (request, reply) => userController.restore(request, reply));

}
