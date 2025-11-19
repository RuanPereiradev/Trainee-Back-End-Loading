import { FastifyInstance } from "fastify";
import { MembershipController } from "../controllers/MembershipController";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { request } from "http";

const membershipRepository = new MembershipRepository();

export async function membershipRoutes(app: FastifyInstance) {

    const membershipController = new MembershipController();
    app.post("/memberships/join", (request, reply) =>  membershipController.joinProject(request, reply));
    app.get("/memberships/pagination", (request, reply) => membershipController.listPagineted(request, reply));
    app.get("/memberships/project/:projectId", (request, reply) => membershipController.listByProject(request, reply));
    app.get("/memberships/:id", (request, reply) => membershipController.findByIdMembership(request, reply));
    app.get("/memberships", (request,reply) => membershipController.findAllMembership(request, reply));
    app.post("/memberships/leave", (request, reply) =>  membershipController.leaveProject(request, reply));
    app.post("/memberships/rejoin", (request, reply) =>  membershipController.rejoinProject(request, reply));

}
