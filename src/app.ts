import Fastify from "fastify";
import { userRoutes } from "../src/web/routes/UserRoutes";

const app = Fastify({
  logger: true,
});

// registra as rotas do usuário
app.register(userRoutes);

export default app;
