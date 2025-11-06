// import { Sectors } from "../../domain/entities/Sectors";
// import { Result } from "../../env/Result";
// import { ISectorRepository } from "../interfaces/ISectorRepository";
// import { Prisma, PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export class SectorRepository implements ISectorRepository{
//     findById(id: string): Promise<Result<Sectors>> {
//         throw new Error("Method not implemented.");
//     }
//     findAll(): Promise<Result<Sectors[]>> {
//         throw new Error("Method not implemented.");
//     }
//     delete(sector: Sectors): Promise<Result<Sectors>> {
//         throw new Error("Method not implemented.");
//     }
//     update(sector: Sectors): Promise<Result<Sectors>> {
//         throw new Error("Method not implemented.");
//     }
    
//     async save(sector: Sectors): Promise<Result<Sectors>>{
//         try{
//             await prisma.sector.create({
//                 data: {
//                     id: sector.id,
//                     name: sector.name,
//                     description: sector.description
//                 },
//             });

//         return Result.ok<Sectors>(sector)
//         }catch(error: any){
//             return Result.fail<Sectors>(error.message);
//         }
//     }

//     // async findById(id: string): Promise<Result<Sectors>> {
//     //     const sector = this.sectors.find((u)=> u.id === id);
//     //     if(!sector){
//     //         return Result.ok<Sectors>(sector);
//     //     }
//     //     return Result.ok<Sectors>(sector);
//     // }

//     // async findAll(): Promise<Result<Sectors[]>> {
        
//     //     if(this.sectors.length === 0){
//     //         return Result.fail<Sectors[]>("nenhum setor encontrado");
//     //     }
//     //     return Result.ok<Sectors[]>(this.sectors);
//     // }

//     // async update(sector: Sectors): Promise<Result<Sectors>> {

//     //     const index = this.sectors.findIndex((u)=> u.id === sector.id);

//     //     if(index === -1){
//     //         return Result.fail<Sectors>("Setor não encontrado")
//     //     }

//     //     this.sectors[index] = sector;
//     //     return Result.ok<Sectors>(sector);
//     // }

//     // async delete(sector: Sectors): Promise<Result<Sectors>> {

//     //     const index = this.sectors.findIndex((u)=> u.id === sector.id);

//     //     if(index === -1){
//     //         return Result.fail<Sectors>("Usuário não encontrado");
//     //     }

//     //     this.sectors.splice(index, 1);
//     //    return  Result.ok<Sectors>();

//     // }
// }