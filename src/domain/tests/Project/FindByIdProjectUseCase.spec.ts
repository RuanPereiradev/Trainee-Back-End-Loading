    import { Project } from "@prisma/client";
import { Result } from "../../../env/Result";
    import { FindByIdProjectUseCase } from "../../../useCases/project/FindByIdProjectUseCase";

    describe("FindByIdProjectUseCase", () =>{
        let mockRepoProj: any;
        let useCase: FindByIdProjectUseCase;

        beforeEach(() =>{
            mockRepoProj = {
                findById: jest.fn(),
            };

            useCase = new FindByIdProjectUseCase(mockRepoProj);
        });

        it("Deve retornar um projeto qunado o ID existir",  async () => {
            const fakeProj = {id: "123", name: "Banco de Dados"};

            mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));

            const result = await useCase.execute({id: "123"});

            expect(result.isSuccess).toBe(true);
            expect(result.getValue()).toEqual(fakeProj);
            expect(mockRepoProj.findById).toHaveBeenCalledWith("123");
        });

        it("deve retornar erro quando o projeto não for encontrado", async () => {
            mockRepoProj.findById.mockResolvedValue(Result.fail<Project>("Projeto nao encontrado"));

            const result = await useCase.execute({id:"999"});

            expect(result.isFailure).toBe(true);
            expect(result.getError()).toBe("Projeto nao encontrado");
        });

        it("deve retornar erro quando o repositório lançar exceção", async () =>{
            mockRepoProj.findById.mockRejectedValue(new Error("db error"));

            const result = await useCase.execute({id: "123"});

            expect(result.isFailure).toBe(true);
            expect(result.getError()).toBe("db error");
        });
    })