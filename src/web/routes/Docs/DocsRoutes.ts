import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fs from "fs";

export async function DocsRoutes(app: FastifyInstance) {
  // Rota principal da documentação
  app.get("/docs", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Caminho ABSOLUTO para o arquivo HTML
      // O __dirname aqui é src/web/routes, então subimos 1 nível
      const docsPath = path.join(__dirname, "..", "Docs", "index.html");
      
      console.log("📁 Tentando carregar docs de:", docsPath);
      console.log("📁 __dirname atual:", __dirname);
      
      // Verifica se o arquivo existe
      if (!fs.existsSync(docsPath)) {
        console.error("❌ Arquivo não encontrado:", docsPath);
        
        // Lista o que existe no diretório
        const parentDir = path.join(__dirname, "..");
        console.log("📁 Conteúdo de", parentDir, ":");
        try {
          const files = fs.readdirSync(parentDir);
          console.log(files);
        } catch (err) {
          console.error("Erro ao listar diretório:", err);
        }
        
        return reply.status(404).send({
          error: "Arquivo não encontrado",
          details: `Caminho: ${docsPath}`
        });
      }
      
      // Lê o arquivo HTML
      const htmlContent = fs.readFileSync(docsPath, "utf-8");
      
      // Define cabeçalhos e envia HTML
      reply.header("Content-Type", "text/html; charset=utf-8");
      return reply.send(htmlContent);
    } catch (error: any) {
      console.error("❌ Erro ao carregar documentação:", error);
      return reply.status(500).send({
        error: "Erro ao carregar documentação",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      });
    }
  });

  // Rota raiz redireciona para docs
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect("/docs");
  });

  // Rota de saúde da API
  app.get("/health", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ 
      status: "online", 
      timestamp: new Date().toISOString(),
      docs: `${request.protocol}://${request.hostname}/docs`,
      environment: process.env.NODE_ENV || "development"
    });
  });
}