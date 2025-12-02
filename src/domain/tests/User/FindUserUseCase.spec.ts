import { FindUserByIdUseCase } from "../../../useCases/user/FindUserByIdUseCase";
import { Result } from "../../../env/Result";

describe("FindUserByIdUseCase", () => {
let mockUserRepo: any;
let useCase: FindUserByIdUseCase;

    beforeEach(() => {
        mockUserRepo = {
            findById: jest.fn(),
        };

        useCase = new FindUserByIdUseCase(mockUserRepo);
    });

    it("deve retornar o usuário quando o ID existir", async () => {
        const fakeUser = { id: "123", name: "Ruan" };

        mockUserRepo.findById.mockResolvedValue(Result.ok(fakeUser));

        const result = await useCase.execute({ id: "123" });

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toEqual(fakeUser);
        expect(mockUserRepo.findById).toHaveBeenCalledWith("123");
    });

    it("deve retornar erro quando o usuário não for encontrado", async () => {
        mockUserRepo.findById.mockResolvedValue(null); 

        const result = await useCase.execute({ id: "999" });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Usuário não encontrado");
    });

    it("deve retornar erro quando o repositório lançar exceção", async () => {
        mockUserRepo.findById.mockRejectedValue(new Error("db error"));

        const result = await useCase.execute({ id: "123" });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("db error");
    });

});
