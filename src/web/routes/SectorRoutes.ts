import { FastifyInstance } from "fastify";
import { SectorController } from "../controllers/SectorController";

export async function SectorRoutes(app:FastifyInstance) {
    const sectorController = new SectorController();

    app.post("/sectors", (request, reply) => sectorController.createSector(request, reply));
    app.get("/sectors", (request, reply) => sectorController.findAll(request, reply));
    app.get("/sectors/sectorId", (request, reply) => sectorController.findSectorById(request, reply));
    app.put("/sectors/sectorId", (request, reply) => sectorController.updateSector(request, reply));
       
}