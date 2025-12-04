import Fastify from "fastify";
import { userRoutes } from "../src/web/routes/UserRoutes";
import { projectRoutes } from "./web/routes/ProjectRoutes";
import { membershipRoutes } from "./web/routes/MembershipRoutes";
import { SectorRoutes } from "./web/routes/SectorRoutes";
import { CoordenadorJoinMemberRoutes } from "./web/routes/CoordenadorJoinMemberRoutes";
import {setupSwagger}  from "./config/swagger/swagger";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { DocsRoutes } from "./web/routes/Docs/DocsRoutes";


const app = Fastify({
  logger: true,
});

app.register(fastifyCors, {origin:'*'})
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


setupSwagger(app)

app.register(DocsRoutes);

// registra as rotas do usuário
app.register(userRoutes);
app.register(projectRoutes);
app.register(membershipRoutes);
app.register(SectorRoutes);
app.register(CoordenadorJoinMemberRoutes)

export default app;


