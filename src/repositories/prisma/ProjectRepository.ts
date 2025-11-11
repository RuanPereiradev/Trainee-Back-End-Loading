import { PrismaClient } from "@prisma/client";
import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../interfaces/IProjectRepository";
import { Sectors } from "../../domain/entities/Sectors";

const prisma = new PrismaClient();

export class ProjectRepository implements IProjectRepository{

    
async save(project: Project): Promise<Result<Project>> {
    try {
      const created =  await prisma.project.create({
            data: {
                id: project.id,
                name:project.name,
                description: project.description,
                goals: project.goals,
                status: project.status,
                sector:{
                    connect:{id: project.sector.id!}
                },
            },
            include:{
                sector: true,
            }
        });

        const sector = new Sectors(
            created.sector.name,
            created.sector.description ?? "",
            created.sector.id
        );
        const newProject = new Project(
          created.name,
          sector,
          created.status,
          created.goals,
          created.description,
          created.id
        );
    
        return Result.ok<Project>(newProject)
    } catch (error: any) {
        return Result.fail<Project>(error.message);
    }
}

async findByName(name: string): Promise<Result<Project[]>> {
    try {
    const found = await prisma.project.findMany({
        where: {
            name:{
                equals: name,
                mode: 'insensitive',
            },
        },
    });
    
    if(found.length === 0){
    return Result.fail<Project[]>("Project not found")
    }

    const project = found.map(
        (u: any) => new Project(
            u.name,
            u.sector,
            u.description,
            u.status,
            u.goals
        )
    );

    return Result.ok<Project[]>(project);
    } catch (error: any) {
    return Result.fail<Project[]>(error.message);
    }
}

 async findBySectorId(sectorId: number): Promise<Result<Project[]>> {
    try {
        const found = await prisma.project.findMany({
            where:{sectorId},
            include:{sector:true}
        });
      
        const project = found.map(p => {
            const sector = new Sectors(
                p.sector.name,
                p.sector.description ?? "",
                p.sector.id
            )
            return new Project(
                p.name,
                sector,
                p.status,
                p.goals,
                p.description,
                p.id 
            );
        });

        return Result.ok<Project[]>(project)
    } catch (error:any) {
        return Result.fail<Project[]>(error.message)
    }
}

async findById(id: string): Promise<Result<Project>> {
    try {
    const found = await prisma.project.findUnique({
        where: {id},
        include: {sector:true}
    });
    if(!found){
        return Result.fail<Project>("Project not found")
    }
    const sector = new Sectors(
        found.sector.name,
        found.sector.description ?? "",
        found.sector.id,
    )
    const project = new Project(
        found.name,
        sector,
        found.status,
        found.goals,
        found.description,
        found.id    
    );
    return Result.ok<Project>(project);
    } catch (error: any) {
        return Result.fail<Project>(error.message)
    }
}

async findAll(): Promise<Result<Project[]>> {
    try {
    const found = await prisma.project.findMany();

    const project = found.map(
        (u: any) => new Project(
            u.name,
            u.sector,
            u.description,
            u.status,
            u.goals
        )
    );
    return Result.ok<Project[]>(project)
    } catch (error: any) {
        return Result.fail<Project[]>(error.message)
    }
}


async update(project: Project): Promise<Result<Project>> {
    try {
    const update = await prisma.project.update({
        where:{id: project.id},
            data: {
                name: project.name,
                description: project.description,
                status: project.status,
                goals: project.goals,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                sector: {
                    connect:{id:project.sector.id!}
                },
            },
            include:{
                sector:true,
            }
    });
    const sectorEntity = new Sectors(
        update.sector.name,
        update.sector.description!,
        update.sector.id
    )
    const projectEntity = new Project(
        update.name,
        sectorEntity,
        update.status,
        update.description,
        update.id
    )
    return Result.ok<Project>(projectEntity)
    } catch (error: any) {
        return Result.fail<Project>(error.message);
    }
}
    
async delete(id: string): Promise<Result<void>> {
    try{
        await prisma.project.delete({where:{id}});
        return Result.ok<void>();

    }catch(error: any){
        return Result.fail<void>(error.message);
    }
    }
}