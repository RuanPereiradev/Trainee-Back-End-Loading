import { FastifyInstance } from "fastify";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { MembershipController } from "../controllers/MembershipController";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { UserController } from "../controllers/UserController";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { CoordenadorEditProject } from "../controllers/CoordenadorEditProjectController";

const membershipRepository = new MembershipRepository();
const userRepository = new UserRepository();
const projectRepository =  new ProjectRepository();

export async function CoordenadorJoinMemberRoutes(app: FastifyInstance){
    
    const coordenadorEditProjectController = new CoordenadorEditProject()
    // app.patch("/projects/:projectId/coordenador/:userId", {preHandler:[authMiddleware]}, (request, reply) => coordenadorEditProjectController.(request, reply))
    app.post("/projects/:projectId/coordenador/:coordenadorId/add/:userIdToAdd",
        {
          schema:{
            tags:['Coordenador'],
            description: 'Coordenador add member',
          },
          preHandler: [authMiddleware]
        },
        (request, reply) => coordenadorEditProjectController.addMember(request, reply));

    app.put("/project/:projectId/coordenador/:coordenadorId/edit/:projectIdToEdit",
        {  
        schema:{
            tags:['Coordenador'],
            description: 'Coordenador add member',
          },
          preHandler: [authMiddleware]
        },
        (request, reply) => coordenadorEditProjectController.EditProject(request, reply));
}
