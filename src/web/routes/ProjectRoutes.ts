// import { FastifyInstance } from "fastify";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireCoordenador } from "../../middlewares/RequireCoordenadorMiddleware";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";
import { requireCoordenadorOrDirector } from "../../middlewares/RequireCoordenadorOrDIretorMiddleware";
import z from "zod";
import { FastifyTypedInstance } from "../../config/swagger/FastifyTypedInstance";


export async function projectRoutes(app:FastifyTypedInstance) {
    
    const projectController = new ProjectController();

    app.post("/projects",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Create Projects',
        body: z.object({
          name: z.string().min(1).describe("Nome do usuário"),
          sectorId: z.number().describe("id do setor"),
          status: z.enum(["PLANEJADO" , "EM_ANDAMENTO" , "PAUSADO" , "CONCLUIDO"]),
          description: z.string().min(6).describe("Descrição"),
          goals: z.string().min(6).describe("Metas")
        })
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.createProject(request, reply));
    app.get("/projects",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Create Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.findAll(request, reply));

    app.get("/projects/:id",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Get Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.findById(request, reply));
    app.get("/projects/pagination",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Get pagination Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.listPagineted(request, reply));

    app.get("/projects/sector/:sectorId", 
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'GetBySector Projects',
      },
      preHandler: [authMiddleware,requireDirector]
    },
    (request, reply) => projectController.findProjectBySector(request, reply));

    app.put("/projects/:id",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Update Projects',
        body: z.object({
          name: z.string().min(1).describe("Nome do usuário"),
          sectorId: z.number().describe("id do setor"),
          status: z.enum(["PLANEJADO" , "EM_ANDAMENTO" , "PAUSADO" , "CONCLUIDO"]),
          description: z.string().min(6).describe("Descrição"),
          goals: z.string().min(6).describe("Metas")
        })
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.updateProject(request, reply));

    app.delete("/projects/:id",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Delete Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.deleteProject(request, reply));

    app.patch("/projects/:id/restore",
    {
      schema:{
        tags:['Projects'],
         security: [{ bearerAuth: [] }],
        description: 'Restore Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) => projectController.restore(request, reply));

}