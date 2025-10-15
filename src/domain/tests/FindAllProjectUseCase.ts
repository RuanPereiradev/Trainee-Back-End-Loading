import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { CreateProjectUseCase } from "../../userCases/project/CreateProjectUseCase";
import { FindAllProjectUseCase } from "../../userCases/project/FindAllProjectUseCase";
import { Sectors } from "../../domain/entities/Sectors";

async function runFindAllProjectTest() {
  const repo = new ProjectRepository();
  const createProject = new CreateProjectUseCase(repo);
  const findAllProject = new FindAllProjectUseCase(repo);

  // Teste quando não há projetos
  const emptyResult = await findAllProject.execute();
  if (emptyResult.isFailure) {
    console.log("🔍 Resultado esperado (sem projetos):", emptyResult.getError());
  }

  // Criar alguns projetos
  const setor = new Sectors("Tecnologia", "Área de desenvolvimento");
  await createProject.execute({
    name: "Projeto Alpha",
    description: "Primeiro projeto",
    sector: setor,
  });
  await createProject.execute({
    name: "Projeto Beta",
    description: "Segundo projeto",
    sector: setor,
  });

  // Buscar todos os projetos
  const allProjectsResult = await findAllProject.execute();
  if (allProjectsResult.isSuccess) {
    const projects = allProjectsResult.getValue();
    console.log(`✅ ${projects.length} projetos encontrados:`);
    projects.forEach((p) =>
      console.log(`📛 ${p.name} | 📄 ${p.description} | 🏢 ${p.sector.name}`)
    );
  } else {
    console.error("❌ Erro ao buscar projetos:", allProjectsResult.getError());
  }
}

runFindAllProjectTest();
