import { Sectors } from "./entities/Sectors";
import { Result } from "../env/Result";
import { Project } from "./entities/Projects";

// Primeiro criamos um setor válido
const setor = new Sectors("Desenvolvimento", "top");

// Agora tentamos criar um projeto válido
const projectResult = Project.create("Projeto Alpha", setor, "Descrição do projeto");

// Verificamos se deu certo
if (projectResult.isFailure) {
    console.log("Erro ao criar projeto:", projectResult.getError());
} else {
    const projeto = projectResult.getValue();
    console.log("Projeto criado com sucesso!");
    console.log("ID:", projeto.id);
    console.log("Nome:", projeto.name);
    console.log("Descrição:", projeto.description);
    console.log("Setor:", projeto.sector.name);
}

// Agora tentamos criar um projeto inválido (nome vazio)
const projectResult2 = Project.create("", setor);

if (projectResult2.isFailure) {
    console.log("Erro esperado ao criar projeto inválido:", projectResult2.getError());
} else {
    console.log("Deveria ter falhado!");
}
