import { FastifyInstance } from "fastify";
import { MembershipController } from "../controllers/MembershipController";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";
import { requireCoordenador } from "../../middlewares/RequireCoordenadorMiddleware";
import { requireCoordenadorOrDirector } from "../../middlewares/RequireCoordenadorOrDIretorMiddleware";

const membershipRepository = new MembershipRepository();

export async function membershipRoutes(app: FastifyInstance) {

    const membershipController = new MembershipController();
    app.post("/memberships/join",
    {
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Join Projects',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) =>  membershipController.joinProject(request, reply));

    app.get("/memberships/pagination",
    {
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => membershipController.listPagineted(request, reply));

    app.get("/memberships/project/:projectId",
    {
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Get Memberhsip by Projects',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) => membershipController.listByProject(request, reply));
    app.get("/memberships/:id",{
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware, requireDirector]
    }, (request, reply) => membershipController.findByIdMembership(request, reply));

    app.get("/memberships",
    {
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware]
    },
    (request,reply) => membershipController.findAllMembership(request, reply));

    app.get("/memberships/me",
    {
      schema:{
        tags:['Membership'],
        security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware]
    },
    (request,reply) => membershipController.findSelfProject(request, reply));

    app.post("/memberships/leave",
    {
      schema:{
        tags:['Membership'],
         security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware]
    },
    (request, reply) =>  membershipController.leaveProject(request, reply));

    app.post("/memberships/rejoin",
    {
      schema:{
        tags:['Membership'],
         security: [{ bearerAuth: [] }],
        description: 'Get Pagination Sectors',
      },
      preHandler: [authMiddleware, requireDirector]
    },
    (request, reply) =>  membershipController.rejoinProject(request, reply));

}
