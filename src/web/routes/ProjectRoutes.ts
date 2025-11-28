import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireCoordenador } from "../../middlewares/RequireCoordenadorMiddleware";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";
import { requireCoordenadorOrDirector } from "../../middlewares/RequireCoordenadorOrDIretorMiddleware";

export async function projectRoutes(app:FastifyInstance) {
    
    const projectController = new ProjectController();

    app.post("/projects",
    {
      schema:{
        tags:['Projects'],
        description: 'Create Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.createProject(request, reply));
    app.get("/projects",
    {
      schema:{
        tags:['Projects'],
        description: 'Create Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.findAll(request, reply));

    app.get("/projects/:id",
    {
      schema:{
        tags:['Projects'],
        description: 'Get Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.findById(request, reply));
    app.get("/projects/pagination",
    {
      schema:{
        tags:['Projects'],
        description: 'Get pagination Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.listPagineted(request, reply));

    app.get("/projects/sector/:sectorId", 
    {
      schema:{
        tags:['Projects'],
        description: 'GetBySector Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.findProjectBySector(request, reply));

    app.put("/projects/:id",
    {
      schema:{
        tags:['Projects'],
        description: 'Update Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.updateProject(request, reply));

    app.delete("/projects/:id",
    {
      schema:{
        tags:['Projects'],
        description: 'Delete Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.deleteProject(request, reply));

    app.patch("/projects/:id/restore",
    {
      schema:{
        tags:['Projects'],
        description: 'Restore Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => projectController.restore(request, reply));

}