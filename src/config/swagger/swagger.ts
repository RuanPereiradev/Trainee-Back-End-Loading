import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI, { fastifySwaggerUi } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export async function setupSwagger(app: FastifyInstance) {

  await app.register(swagger, {
    openapi: {
      info: {
        title: "API da Aplicação",
        description: "Documentação oficial da API",
        version: "1.0.0"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat:"JWT"
          }
        }
      }
    }, 
    transform: jsonSchemaTransform
  }); 

  await app.register(fastifySwaggerUi, {
    routePrefix: "/swagger",
    uiConfig: {
      docExpansion: "list"
    }
  });
}
