import { Sectors } from "../../domain/entities/Sectors";
import { Project } from "../../domain/entities/Projects";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { CreateProjectUseCase } from "../../useCases/project/CreateProjectUseCase";
import { DeleteProjectUseCase } from "../../useCases/project/DeleteProjectUseCase";

async function testDeleteProjectUseCase() {
  // Instanciando repositório e casos de uso
  const projectRepo = new ProjectRepository();
  const createProjectUseCase = new CreateProjectUseCase(projectRepo);
  const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo);

  // 1️⃣ Cria um setor e um projeto inicial
  const setor = new Sectors("Engenharia", "Setor responsável pelos projetos");
  const createResult = await createProjectUseCase.execute({
    name: "Projeto de Teste",
    description: "Projeto temporário para testar exclusão",
    sector: setor,
  });

  if (createResult.isFailure) {
    console.error("❌ Erro ao criar projeto:", createResult.getError());
    return;
  }

  const projeto = createResult.getValue();
  console.log("✅ Projeto criado:", projeto.name, "| ID:", projeto.id);

  const deleteResult = await deleteProjectUseCase.execute({ id: projeto.id });

if (deleteResult.isSuccess) {

  const deletedProject = deleteResult.getValue();
  console.log(`🗑️ Projeto deletado com sucesso: ${deletedProject.name} (${deletedProject.id})`);
  console.log("📄 Descrição:", deletedProject.description);
  console.log("🏢 Setor:", deletedProject.sector.name);
  
} else {
  console.error("❌ Erro ao deletar projeto:", deleteResult.getError());
}


  // 3️⃣ Tenta buscar o projeto novamente (deve falhar)
  const findAfterDelete = await projectRepo.findById(projeto.id);
  if (findAfterDelete.isFailure) {
    console.log("🔍 Confirmação: projeto não existe mais (como esperado)");
  } else {
    console.error("⚠️ Erro: projeto ainda encontrado após exclusão!");
  }

  // 4️⃣ Testa exclusão com ID inexistente
  const invalidDelete = await deleteProjectUseCase.execute({
    id: "id-invalido-qualquer",
  });

  if (invalidDelete.isFailure) {
    console.log("🚫 Exclusão com ID inválido retornou erro esperado:", invalidDelete.getError());
  } else {
    console.error("⚠️ Erro: deveria ter falhado com ID inexistente");
  }
}

testDeleteProjectUseCase();
