import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";

export async function projectRoutes(app:FastifyInstance) {
    const projectController = new ProjectController();

    app.post("/projects",{preHandler: [authMiddleware]},(request, reply) => projectController.createProject(request, reply));
    app.get("/projects",{preHandler: [authMiddleware]},(request, reply) => projectController.findAll(request, reply));
    app.get("/projects/:id",{preHandler: [authMiddleware]},(request, reply) => projectController.findById(request, reply));
    app.get("/projects/pagination", {preHandler: [authMiddleware]},(request, reply) => projectController.listPagineted(request, reply));
    app.get("/projects/sector/:sectorId", {preHandler: [authMiddleware]},(request, reply) => projectController.findProjectBySector(request, reply));
    app.put("/projects/:id",{preHandler: [authMiddleware]},(request, reply) => projectController.updateProject(request, reply));
    app.delete("/projects/:id",{preHandler: [authMiddleware]},(request, reply) => projectController.deleteProject(request, reply));
    app.patch("/projects/:id/restore",{preHandler: [authMiddleware]},(request, reply) => projectController.restore(request, reply));

}