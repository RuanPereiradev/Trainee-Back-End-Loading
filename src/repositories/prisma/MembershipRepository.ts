import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { Project } from "../../domain/entities/Projects";
import { SectorController } from "../../web/controllers/SectorController";
import { SectorRepository } from "./SectorRepository";
import { Sectors } from "../../domain/entities/Sectors";
import { UserRepository } from "./UserRepository";
import { PaginationResult } from "../../web/Wrappers/Pagination";

const prisma = new PrismaClient();

export class MembershipRepository implements IMembershipRepository {

    private sectorRepository: SectorRepository;
    private userRepository: UserRepository;

    constructor(){
        this.sectorRepository = new SectorRepository();
        this.userRepository = new UserRepository()
    }

    async  update(membership: Membership): Promise<Result<Membership>> {
        try {
            const update = await prisma.membership.update({
                where:{id: membership.id},
                data: {
                    joinedAt:membership.joinedAt,
                    leftAt: membership.leftAt
                }
            })
            return Result.ok<Membership>()
        } catch (error:any) {
            return Result.fail<Membership>(error.message)
        }
    }

    async findAll(): Promise<Result<Membership[]>> {
            try {
            const found = await prisma.membership.findMany({
                    include: {user: true, 
                        project: {
                        include:{ sector:true }
                    }
                }
            });
            const membership = found.map(u=> {
                const user = new User(
                    u.user.name,
                    new Email(u.user.email),
                    new Password(u.user.password),
                    u.user.role,
                    u.user.id
                );
                const sector = new Sectors(
                    u.project.sector.name,
                    u.project.sector.description ?? "",
                    u.project.sector.id
                );
                const project = new Project(
                    u.project.name,
                    sector,
                    u.project.status,
                    u.project.goals,
                    u.project.description,
                    u.project.id,

                );
                return new Membership(
                    user,
                    project,
                    u.id,
                    u.joinedAt
                );
            });
            return Result.ok<Membership[]>(membership) 
            } catch (error: any) {
                return Result.fail<Membership[]>(error.message)
            }
        }
    async listPaginated(page: number, pageSize: number): Promise<PaginationResult<Membership>> {
        const skip = (page-1) * pageSize;

        const [items, total] = await Promise.all([
            prisma.membership.findMany({
                where:{leftAt: null},
                skip,
                take: pageSize,
                include:{
                    user: true,
                    project:{
                        include: {
                            sector: true
                        }
                    }
                }
            }),
            prisma.membership.count({
                where: {leftAt:null}
            })
        ]);
        const membership = items.map(u=> {
            const user = new User(
                u.user.name,
                new Email(u.user.email),
                new Password(u.user.password),
                u.user.role,
                u.user.id
            );
            const sector = new Sectors(
                u.project.sector.name,
                u.project.sector.description ?? "",
                u.project.sector.id
            );
            const project = new Project(
                u.project.name,
                sector,
                u.project.status,
                u.project.description,
                u.project.id
            );
            return new Membership(
                user,
                project,
                u.id,
                u.joinedAt
            );
        });

        return {
            data: membership,
            page,
            pageSize,
            total, 
            totalPages: Math.ceil(total/pageSize)
        }
    }

    leaveProject(id: string): Promise<Result<Membership>> {
        throw new Error("Method not implemented.");
    }
    async create(membership: Membership): Promise<Result<Membership>> {
        try {
            const created = await prisma.membership.create({
                data:{
                    id: membership.id,
                    joinedAt: membership.joinedAt,
                    leftAt: membership.leftAt,
                    user:{
                        connect:{id: membership.user.id}
                    },
                    project:{
                        connect:{id: membership.project.id}
                    },
                },
                include:{
                    user: true,
                    project: true
                }
            });

            const sectorResult = await this.sectorRepository.findById(created.project.sectorId);
            if(sectorResult.isFailure){
                return Result.fail("Setor do projeto não encontrado");
            }
            const sector = sectorResult.getValue();

            const user = new User(
                created.user.name,
                new Email(created.user.email),
                new Password(created.user.password),
                created.user.role
            );
            const project = new Project(
                created.project.name,
                sector,
                created.project.status,
                created.project.goals,
                created.project.description,
                created.project.id
            )

            const membershipEntity = new Membership(
                user,
                project,
                created.id,
                created.joinedAt
            );

            return Result.ok(membershipEntity);

        } catch (error:any) {
            return Result.fail("Erro ao salvar membership: " + error.message);

        }
    }
    async findById(id: string): Promise<Result<Membership | null>> {
        try {
            const found = await prisma.membership.findUnique({
                where: {id},
                include: {user: true, project: true}
            });
            if(!found){
                return Result.fail<Membership>("Membership nao encontrado")
            }

            const sectorResult = await this.sectorRepository.findById(found.project.sectorId);
            if(sectorResult.isFailure){
                return Result.fail("Setor do projeto não encontrado");
            }
            const sector = sectorResult.getValue();

            const user = new User(
                found.user.name,
                new Email(found.user.email),
                new Password(found.user.password),
                found.user.role,
                found.user.id
            );

            const project = new Project(
                found.project.name,
                sector,
                found.project.status,
                found.project.goals,
                found.project.description,
                found.project.id
            );

            const membership = new Membership(
                user,
                project,
                found.id,
                found.joinedAt
            );
            return Result.ok<Membership>(membership);
        } catch (error:any) {
            return Result.fail<Membership>(error.message)
        }
    }

    async findByUserAndProject(userId: string, projectId: string): Promise<Result<Membership | null>> {
        try {
            const found = await prisma.membership.findFirst({
                where: {userId, projectId},
                include:{
                    user: true,
                    project: true
                }
            });

            if(!found){
                return Result.ok(null)
            }

            const sectorResult = await this.sectorRepository.findById(found.project.sectorId);
            if(sectorResult.isFailure){
                return Result.fail("Setor do projeto não encontrado");
            }
            const sector = sectorResult.getValue();

            const user = new User(
                found.user.name,
                new Email(found.user.email),
                new Password(found.user.password),
                found.user.role,
                found.user.id
            );

            const project = new Project(
                found.project.name,
                sector,
                found.project.status,
                found.project.goals,
                found.project.description,
                found.project.id
            );
            
            const membership = new Membership(
                user,
                project,
                found.id, 
                found.joinedAt
            );

            if(found.leftAt){
               ( membership as any)._leftAt = found.leftAt
            }

            return Result.ok(membership);

        } catch (error: any) {
            return Result.fail<Membership>(error.message)
        }
    }

    async findByDirectorProject(projectId: string): Promise<Result<Membership | null>> {
        try {
            const found = await prisma.membership.findFirst({
                where: {
                    projectId,
                    leftAt: null,
                    user:{
                        role: "DIRETOR"
                    }
                },
                include:{
                    user:true,
                    project:true
                }
            });

            if(!found){
                return Result.ok(null)
            }

            const sectorResult = await this.sectorRepository.findById(found.project.sectorId);
            if(sectorResult.isFailure){
                return Result.fail("Setor do projeto não encontrado");
            }
            const sector = sectorResult.getValue();

            const user = new User(
                found.user.name,
                new Email(found.user.email),
                new Password(found.user.password),
                found.user.role,
                found.user.id
            );

            const project = new Project(
                found.project.name,
                sector,
                found.project.status,
                found.project.goals,
                found.project.description,
                found.project.id
            );

            const membership = new Membership(
                user,
                project,
                found.id, 
                found.joinedAt
            );

            if(found.leftAt){
                (membership as any)._leftAt = found.leftAt
            }

            return Result.ok(membership)
            
        } catch (error:any) {
            return Result.fail(error.message)
        }
    }
    async findByCoordenadorProject(projectId: string): Promise<Result<Membership | null>> {
        try {
            const found = await prisma.membership.findFirst({
                where:{
                    projectId,
                    leftAt: null,
                    user:{
                        role:"COORDENADOR"
                    }
                },
                include:{
                    user:true,
                    project:true
                }
            });

            if(!found){
                return Result.ok(null)
            }

            const sectorResult = await this.sectorRepository.findById(found.project.sectorId);
            if(sectorResult.isFailure){
                return Result.fail("Setor do projeto não encontrado");
            }
            const sector = sectorResult.getValue();

            const user = new User(
                found.user.name,
                new Email(found.user.email),
                new Password(found.user.password),
                found.user.role,
                found.user.id
            )

            const project = new Project(
                found.project.name,
                sector,
                found.project.status,
                found.project.goals,
                found.project.description,
                found.project.id
            );

            const membership = new Membership(
                user,
                project,
                found.id, 
                found.joinedAt
            );

            if(found.leftAt){
               ( membership as any)._leftAt = found.leftAt
            }

            return Result.ok(membership)
        } catch (error: any) {
            return Result.fail(error.message)
        }
    }
    
    async listByProject(projectId: string): Promise<Result<Membership[]>> {
        try {
            const found = await prisma.membership.findMany({
                where: {projectId},
                include: {user:true, project: true}
            });

            if(!found||found.length === 0){
                return Result.fail<Membership[]>("nenhuma membership encontrada")
            }

          const memberships = await Promise.all(
                found.map(async(m) => {
                const sectorResult = await this.sectorRepository.findById(m.project.sectorId);
                
                if(sectorResult.isFailure){
                    throw new Error("Setor do projeto não encontrado");
                }

                const sector = sectorResult.getValue();

                const user = new User(
                    m.user.name,
                    new Email(m.user.email),
                    new Password(m.user.password),
                    m.user.role,
                    m.user.id
                );
                const project = new Project(
                    m.project.name,
                    sector, 
                    m.project.status,
                    m.project.goals,
                    m.project.description,
                    m.project.id
            );

              return new Membership(
                user,
                project,
                m.id,
                m.joinedAt
            );
        })
    );

        return Result.ok(memberships);
        
        } catch (error: any) {
            return Result.fail(error.message)    
        }
    }
    async listByUser(userId: string): Promise<Result<Membership[]>>{
        try {
            const found = await prisma.membership.findMany({
                where: {userId},
                include:{user: true,project: true}
            });
            
            if(!found||found.length === 0){
                return Result.fail<Membership[]>("Nenhuma membership encontrada")
            }

            const memberships = await Promise.all(
                found.map(async(m) => {
                const sectorResult = await this.sectorRepository.findById(m.project.sectorId);

                if(sectorResult.isFailure){
                    throw new Error("Setor do projeto não encontrado");
                }

                const sector = sectorResult.getValue();

                const user = new User(
                    m.user.name,
                    new Email(m.user.email),
                    new Password(m.user.password),
                    m.user.role,
                    m.user.id
                );
                const project = new Project(
                    m.project.name,
                    sector, 
                    m.project.status,
                    m.project.goals,
                    m.project.description,
                    m.project.id
                );

                return new Membership(
                    user,
                    project,
                    m.id,
                    m.joinedAt
                );
            })
        );
        return Result.ok(memberships);

        } catch (error:any) {
            return Result.fail(error.message)
        }
    }
    

    
}
