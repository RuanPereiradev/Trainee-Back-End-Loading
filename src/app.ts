import Fastify from "fastify";
import { userRoutes } from "../src/web/routes/UserRoutes";
// import { projectRoutes } from "./web/routes/ProjectRoutes";
import { membershipRoutes } from "./web/routes/MembershipRoutes";
// import { SectorRoutes } from "./web/routes/SectorRoutes";

const app = Fastify({
  logger: true,
});

// registra as rotas do usuário
app.register(userRoutes);
// app.register(projectRoutes);
app.register(membershipRoutes);
// app.register(SectorRoutes);
export default app;
