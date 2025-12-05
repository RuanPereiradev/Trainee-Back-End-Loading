import { FastifyInstance } from "fastify";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { MembershipController } from "../controllers/MembershipController";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { UserController } from "../controllers/UserController";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { CoordenadorEditProject } from "../controllers/CoordenadorEditProjectController";
import { requireCoordenadorOrDirector } from "../../middlewares/RequireCoordenadorOrDIretorMiddleware";
import z from "zod";

const membershipRepository = new MembershipRepository();
const userRepository = new UserRepository();
const projectRepository =  new ProjectRepository();

export async function CoordenadorJoinMemberRoutes(app: FastifyInstance){
    
    const coordenadorEditProjectController = new CoordenadorEditProject();
    
    app.post("/projects/:projectId/coordenador/:coordenadorId/add/:userIdToAdd",
        {
          schema:{
            tags:['Coordenador'],
            security: [{ bearerAuth: [] }],
            description: 'Coordenador add member',
          },
          preHandler: [authMiddleware, requireCoordenadorOrDirector]
        },
        (request, reply) => coordenadorEditProjectController.addMember(request, reply));

    app.put("/project/:projectId/coordenador/:coordenadorId/edit/:projectIdToEdit",
        {  
          schema: {
            tags: ['Coordenador'],
            security: [{ bearerAuth: [] }],
            description: 'Coordenador add member',
            body: z.object({
              name: z.string().min(4, { message: "Nome deve ter pelo menos 4 caracteres" }).describe("Nome do projeto"),
              status: z.enum(["PLANEJADO", "EM_ANDAMENTO", "PAUSADO", "CONCLUIDO"]).describe("Status do projeto"),
              description: z.string().min(6, { message: "Descrição deve ter pelo menos 6 caracteres" }).describe("Descrição"),
              goals: z.string().min(6, { message: "Metas deve ter pelo menos 6 caracteres" }).describe("Metas")
            })
          },
          preHandler: [authMiddleware, requireCoordenadorOrDirector]
        },
        (request, reply) => coordenadorEditProjectController.EditProject(request, reply));

  app.delete("/project/:projectId/coordenador/:coordenadorId/remove/:userIdToRemove",
        {  
        schema:{
            tags:['Coordenador'],
            security: [{ bearerAuth: [] }],
            description: 'Coordenador remove member',
          },
          preHandler: [authMiddleware, requireCoordenadorOrDirector]
        },
        (request, reply) => coordenadorEditProjectController.removeMember(request, reply));
}

