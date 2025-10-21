import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";
import { request } from "http";

export async function projectRoutes(app:FastifyInstance) {
    const projectController = new ProjectController();

    app.post("/projects",(request, reply) => projectController.createProject(request, reply));
    app.get("/projects",(request, reply) => projectController.findAll(request, reply));
    app.get("/projects/:id",(request, reply) => projectController.findById(request, reply));
    app.put("/projects/:id",(request, reply) => projectController.updateProject(request, reply));
    app.delete("/projects/:id",(request, reply) => projectController.deleteProject(request, reply));

    
}