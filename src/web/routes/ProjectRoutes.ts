import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";

export async function projectRoutes(app:FastifyInstance) {
    const projectController = new ProjectController();

    app.post("/projects",(request, reply) => projectController.createProject(request, reply));
    app.get("/projects",(request, reply) => projectController.findAll(request, reply));
    app.get("/projects/:id",(request, reply) => projectController.findById(request, reply));
    app.get("/projects/pagination", (request, reply) => projectController.listPagineted(request, reply));
    app.get("/projects/sector/:sectorId", (request, reply) => projectController.findProjectBySector(request, reply));
    app.put("/projects/:id",(request, reply) => projectController.updateProject(request, reply));
    app.delete("/projects/:id",(request, reply) => projectController.deleteProject(request, reply));
    app.patch("/projects/:id/restore",(request, reply) => projectController.restore(request, reply));

}