import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../interfaces/IProjectRepository";

export class ProjectRepository implements IProjectRepository{

    private projects: Project[] = [];

    async findById(id: string): Promise<Result<Project>> {

        const project = this.projects.find(p=> p.id === id);

        if(!project){
            return Result.fail<Project>("Projeto nao encontrado");
        }
        return Result.ok<Project>(project);
    }

    async findAll(): Promise<Result<Project[]>> {
        return Result.ok<Project[]>(this.projects)
    }

    async save(project: Project): Promise<Result<Project>> {
        const exists = this.projects.find(p=> p.id === project.id);
        if(exists){
            return Result.fail<Project>("Já existe um projeto com esse ID");
        }

         this.projects.push(project);
         return Result.ok<Project>(project); 

        }

    async update(project: Project): Promise<Result<Project>> {

        const index = this.projects.findIndex(p=> p.id === project.id);

        if(index === -1){
            return Result.fail<Project>("Projeto nao encontrado");
        }
        this.projects[index] = project;
        return Result.ok<Project>(project);
    }
    
    async delete(id: string): Promise<Result<void>> {

        const index = this.projects.findIndex(p=> p.id === id);
        
        if(index === -1){
            return Result.fail<void>("Projeto nao encontrado")
        }

        this.projects.splice(index,1);
        return Result.ok<void>();
    }
}
