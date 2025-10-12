import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { Project } from "../entities/Projects";
import { Sectors } from "../entities/Sectors";

async function runProjectTest() {
    const projectRepo = new ProjectRepository();

    const setor = new Sectors("Desenvolvimento", "Setor Principal");

    const projectResult = Project.create("Projeto Alpha", setor, "Descrição");

    if(projectResult.isFailure){
        console.log("Erro ao criar projeto: ", projectResult.getError());
        return;
    }
    const projeto = projectResult.getValue();

    //salvar projeto
    const saveResult = await projectRepo.save(projeto);
    console.log("Salvar projeto:", saveResult.isSuccess ? "Ok": saveResult.getError());
    //busca por id
    const foundById = await projectRepo.findById(projeto.id);
    console.log("Busca por id:", foundById.isSuccess ? foundById.getValue().name : "Nao encontrado");
    //atualizar nome do projeto
    projeto.changeName("Projeto alpha atualizada");
    const updateResult = await projectRepo.update(projeto);
    console.log("atualizar projeto:", updateResult.isSuccess ? "Ok" : updateResult.getError());
    //listar todos
    const allProjects = await projectRepo.findAll();
    console.log("Todos projetos:", allProjects.isSuccess ? allProjects.getValue().map(p=>p.name): "Erro");
    //deletar projeto
    const deleteResult = await projectRepo.delete(projeto.id);
    console.log("Deletar projeto:", deleteResult.isSuccess ? "OK" : deleteResult.getError());
    //listar todos apoós deletar
    const allProjectsAfterDelete = await projectRepo.findAll();
    console.log("Todos apos deletar:", allProjectsAfterDelete.isSuccess ? allProjectsAfterDelete.getValue().map(p=>p.name): "Erro");

}
runProjectTest();