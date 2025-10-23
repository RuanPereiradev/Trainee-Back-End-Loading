import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { CreateProjectUseCase } from "../../useCases/project/CreateProjectUseCase";
import { Sectors } from "../../domain/entities/Sectors";

async function testCreateProjectUseCase() {
  const projectRepo = new ProjectRepository();
  const createProjectUseCase = new CreateProjectUseCase(projectRepo);

  const setor = new Sectors("Desenvolvimento", "Equipe principal");

  const result = await createProjectUseCase.execute({
    name: "Projeto Alpha",
    description: "Primeiro projeto de teste",
    sector: setor,
  });

  if (result.isSuccess) {
    const project = result.getValue();
    console.log("✅ Projeto criado:", project.name, "| Setor:", project.sector.name);
  } else {
    console.error("❌ Erro ao criar projeto:", result.getError());
  }
}

testCreateProjectUseCase();
