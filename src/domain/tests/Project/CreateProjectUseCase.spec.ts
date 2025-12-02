import { ProjectStatusType } from "@prisma/client";
import { Result } from "../../../env/Result";
import { CreateProjectUseCase } from "../../../useCases/project/CreateProjectUseCase";

describe("CreateProjectUseCase", () => {
    let mockRepoProj : any;
    let projectUseCase: CreateProjectUseCase;
    let mockRepoSector: any;

    beforeEach(() => {
        mockRepoProj = {
            findByName: jest.fn(),
            save: jest.fn(),
        };

        mockRepoSector = {
            findById: jest.fn(),
            save: jest.fn()
        };

        projectUseCase = new CreateProjectUseCase(mockRepoProj, mockRepoSector);
    });

    it("deve criar um setor corretamente", async () =>{
        const fakeSector = {id:1, name: "Setor A"}
    })
    

    it("Deve criar o projeto corretamente", async () => {
        //nome ainda não existe
        mockRepoProj.findByName.mockResolvedValue(Result.fail("Not found"));
        mockRepoSector.findById.mockResolvedValue(Result.ok())

        const fakeProj = {
            id: "1",
            name:"proj teste",
            sectorId: 1,
            status: ProjectStatusType.CONCLUIDO,
            description: "Descrição do projeto",
            goals: "Metas do projeto"
        };
        mockRepoProj.save.mockResolvedValue(Result.ok(fakeProj));

        const result = await projectUseCase.execute({
            name:"proj teste",
            sectorId: 1,
            status: ProjectStatusType.CONCLUIDO,
            description: "Descrição do projeto",
            goals: "Metas do projeto"
        });

        expect(result.isSuccess).toBe(true);
        expect(mockRepoProj.findByName).toHaveBeenCalledWith("proj teste");
        expect(mockRepoProj.save).toHaveBeenCalled();
    });

    it("deve retornar um erro se o nome já estiver em uso", async () => {
        mockRepoProj.findByName.mockResolvedValue(Result.ok("existing"));
        mockRepoSector.findById.mockResolvedValue(Result.ok({
            id: 1,
            name: "Setor Teste"
        }));
        
        const result = await projectUseCase.execute({
             name:"proj teste",
            sectorId: 1,
            status: ProjectStatusType.CONCLUIDO,
            description: "Descrição do projeto",
            goals: "Metas do projeto"
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Name already in use")
        
    });

    it("Deve retornar erro se o repositório lançar exceção", async () => {
        mockRepoSector.findById.mockResolvedValue(Result.ok({id:1}))
        mockRepoProj.findByName.mockRejectedValue(new Error("db error"));

        const result = await projectUseCase.execute({
            
             name:"proj teste",
            sectorId: 1,
            status: ProjectStatusType.CONCLUIDO,
            description: "Descrição do projeto",
            goals: "Metas do projeto"
        });
        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("db error");
    });
});

