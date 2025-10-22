import Fastify from "fastify";
import { userRoutes } from "../src/web/routes/UserRoutes";
import { projectRoutes } from "./web/routes/ProjectRoutes";
import { membershipRoutes } from "./web/routes/MembershipRoutes";

const app = Fastify({
  logger: true,
});

// registra as rotas do usuário
app.register(userRoutes);
app.register(projectRoutes);
app.register(membershipRoutes);

export default app;
