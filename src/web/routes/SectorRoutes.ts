import { FastifyInstance } from "fastify";
import { SectorController } from "../controllers/SectorController";
import { ProjectController } from "../controllers/ProjectController";

export async function SectorRoutes(app:FastifyInstance) {
    const sectorController = new SectorController();

    app.post("/sectors", (request, reply)=> sectorController.createSector(request, reply));
    app.get("/sectors", (request, reply)=> sectorController.findAll(request, reply));
}