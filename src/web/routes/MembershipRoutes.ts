import { FastifyInstance } from "fastify";
import { MembershipController } from "../controllers/MembershipController";

export async function membershipRoutes(app: FastifyInstance) {
    const membershipController = new MembershipController();
    
  app.get('/ping', async (req, reply) => reply.send({ message: 'pong' }));
  app.post("/membership", (request, reply) => membershipController.createMembership(request, reply));
  app.get("/membership/:id", (request, reply) => membershipController.findMembershipByProject(request, reply));
  app.get("/membership/:id", (request, reply) => membershipController.findMembershipByUser(request, reply));
  app.get("/membership/:id", (request, reply) => membershipController.findProjectByUser(request, reply));
  app.put("/membership/:id", (request, reply) => membershipController.updateMembership(request, reply));
  app.delete("/membership/:id", (request, reply) => membershipController.deleteMembership(request, reply));

}