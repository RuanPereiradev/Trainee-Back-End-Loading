import { FastifyInstance } from "fastify";
import { SectorController } from "../controllers/SectorController";
import { authMiddleware } from "../../middlewares/AuthMiddlewares";
import { requireDirector } from "../../middlewares/RequireDirectorMiddleware";

export async function SectorRoutes(app:FastifyInstance) {
    const sectorController = new SectorController();

    app.post("/sectors",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.createSector(request, reply));
    app.get("/sectors",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.findAll(request, reply));
    app.get("/sectors/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.findSectorById(request, reply));
    app.put("/sectors/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.updateSector(request, reply));
    app.patch("/sectors/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.restore(request, reply));
    app.delete("/sectors/:id",{preHandler: [authMiddleware, requireDirector]},(request, reply) => sectorController.deleteSector(request, reply));
}