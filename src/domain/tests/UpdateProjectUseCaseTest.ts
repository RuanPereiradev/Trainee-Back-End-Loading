import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { CreateProjectUseCase } from "../../userCases/project/CreateProjectUseCase";
import { UpdateProjectUseCase } from "../../userCases/project/UpdateProjectUseCase";
import { Sectors } from "../../domain/entities/Sectors";

async function runUpdateProjectTest() {
  const repo = new ProjectRepository();
  const createProject = new CreateProjectUseCase(repo);
  const updateProject = new UpdateProjectUseCase(repo);

  // Criar setor e projeto
  const setor = new Sectors("Tecnologia", "Área de desenvolvimento");
  const createResult = await createProject.execute({
    name: "Projeto Inicial",
    description: "Projeto de teste",
    sector: setor,
  });

  if (createResult.isFailure) {
    console.log("❌ Erro ao criar projeto:", createResult.getError());
    return;
  }

  const projeto = createResult.getValue();
  console.log("✅ Projeto criado:");
  console.log("📛 Nome:", projeto.name);
  console.log("📄 Descrição:", projeto.description);
  console.log("🏢 Setor:", projeto.sector.name);

  // Salvar dados antigos
  const oldName = projeto.name;
  const oldDescription = projeto.description;
  const oldSector = projeto.sector.name;

  // Atualizar o projeto
  const updateResult = await updateProject.execute({
    id: projeto.id,
    name: "Projeto Atualizado",
    description: "Descrição modificada",
  });

  if (updateResult.isSuccess) {
    const updated = updateResult.getValue();
    console.log("\n🔄 Projeto atualizado com sucesso!");
    console.log("🕒 Valores antigos:");
    console.log("📛 Nome:", oldName);
    console.log("📄 Descrição:", oldDescription);
    console.log("🏢 Setor:", oldSector);
    console.log("🆕 Valores novos:");
    console.log("📛 Nome:", updated.name);
    console.log("📄 Descrição:", updated.description);
    console.log("🏢 Setor:", updated.sector.name);
  } else {
    console.log("❌ Erro ao atualizar projeto:", updateResult.getError());
  }
}

runUpdateProjectTest();
