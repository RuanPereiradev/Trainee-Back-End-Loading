import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireCoordenador } from "../../middlewares/RequireCoordenadorMiddleware";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";

export async function projectRoutes(app:FastifyInstance) {
    const projectController = new ProjectController();

    app.post("/projects",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.createProject(request, reply));
    app.get("/projects",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.findAll(request, reply));
    app.get("/projects/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.findById(request, reply));
    app.get("/projects/pagination", {preHandler: [authMiddleware,requireDirector]},(request, reply) => projectController.listPagineted(request, reply));
    app.get("/projects/sector/:sectorId", {preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.findProjectBySector(request, reply));
    app.put("/projects/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.updateProject(request, reply));
    app.delete("/projects/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.deleteProject(request, reply));
    app.patch("/projects/:id/restore",{preHandler: [authMiddleware, requireDirector]},(request, reply) => projectController.restore(request, reply));

}