import { Sectors } from "../../domain/entities/Sectors";
import { Result } from "../../env/Result";
import { ISectorRepository } from "../interfaces/ISectorRepository";
import { Prisma, PrismaClient, Sector } from "@prisma/client";

const prisma = new PrismaClient();

export class SectorRepository implements ISectorRepository{

    async findByIdAny(id: number): Promise<Result<Sectors>> {
        try {
          const found = await prisma.sector.findUnique({
            where:{id},
          });
          if(!found){
            return Result.fail<Sectors>("Sector not found")
          }
          const sector = new Sectors(
            found.name, 
            found.description ?? "",
            found.id,
          );
          if(found.deletedAt){
            sector.softDelete();
            (sector as any)._deletedAt = found.deletedAt;
          }
          return Result.ok<Sectors>(sector);
        } catch (error:any) {
            return Result.fail<Sectors>(error.message);
        }
    }
    

    async findByName(name: string): Promise<Result<Sectors | null>> {
        try {
            const found = await prisma.sector.findUnique({
                where: {name},
            });
            if(!found){
                return Result.ok<Sectors | null>(null);
            }

            const sector = new Sectors(found.name, found.description ?? "", found.id);
            return Result.ok<Sectors | null>(sector);
            
        } catch (error:any) {
            return Result.fail<Sectors | null>(`Erro`)
        }
    }

   async findById(id: number): Promise<Result<Sectors>> {
        try {
            const found = await prisma.sector.findFirst({
                where:{id},
            });
            if(!found){
                return Result.fail<Sectors>("Sector not found");
            }
            if(found.deletedAt !== null){
                return Result.fail<Sectors>("sector deleted")
            }
            const sector = new Sectors(
                found.name,
                found.description ?? "",
                found.id,
            );
            return Result.ok<Sectors>(sector);

        } catch (error: any) {
            return Result.fail<Sectors>(error.message)
        }
    }
    async findAll(): Promise<Result<Sectors[]>> {
        try {
          const sector = await prisma.sector.findMany();
          const sectorEntity = sector.map(
            (u) => 
             new Sectors(
             u.name,
             u.description ?? "",
             u.id
            )
          );

          return Result.ok<Sectors[]>(sectorEntity);

        } catch (error: any) {
          return Result.fail<Sectors[]>(error.message);
        }
    }

    async delete(id: number): Promise<Result<void>> {
        try {
          await prisma.sector.update({where:{id}, data:{deletedAt: new Date()}
        });
          return Result.ok<void>();

        } catch (error: any) {
            return Result.fail<void>(error.message)
        }
    }
    async update(sector: Sectors): Promise<Result<Sectors>> {
        try {
          const update = await prisma.sector.update({
            where: {id: sector.id!},
            data: {
                name: sector.name,
                description: sector.description,
            }
          });

          const sectorEntity = new Sectors(
            update.name,
            update.description!,
            update.id
          );
          return Result.ok<Sectors>(sectorEntity);
        } catch (error: any) {
          return Result.fail<Sectors>(error.message)
        }    }
    
    async save(sector: Sectors): Promise<Result<Sectors>>{
        try{
        const saved =  await prisma.sector.create({
                data: {
                    name: sector.name,
                    description: sector.description
                },
            });

        const newSector = new Sectors(saved.name, saved.description ?? "", saved.id)
        return Result.ok<Sectors>(newSector);

        }catch(error: any){
            return Result.fail<Sectors>(error.message);
        }
    }

    async restore(id: number): Promise<Result<void>> {
        try {
            await prisma.sector.update({
                where:{id}, data:{deletedAt:null}
            });
            return Result.ok<void>();
        } catch (error:any) {
            return Result.fail<void>(error.message);
        }
    }
    
}