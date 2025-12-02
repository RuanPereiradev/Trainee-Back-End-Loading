import { DeleteUserUseCase } from "../../../useCases/user/DeleteUserUseCase";
import { Result } from "../../../env/Result";

describe("DeleteUserUseCase", () => {
  let mockRepo: any;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    };

    useCase = new DeleteUserUseCase(mockRepo);
  });

  it("deve deletar o usuário corretamente", async () => {
    const fakeUser = {
      id: "123",
    };

    // retorna um Result.ok contendo o usuário encontrado
    mockRepo.findById.mockResolvedValue(Result.ok(fakeUser));

    // softDelete não retorna nada, então um ok também serve
    mockRepo.softDelete.mockResolvedValue(Result.ok());

    const result = await useCase.execute({ id: "123" });

    expect(result.isSuccess).toBe(true);

    expect(mockRepo.findById).toHaveBeenCalledWith("123");
    expect(mockRepo.softDelete).toHaveBeenCalledWith("123");
  });

  it("deve retornar erro se o usuário não existir", async () => {
    mockRepo.findById.mockResolvedValue(Result.fail("nao existe"));

    const result = await useCase.execute({ id: "999" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário não encontrado");
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockRepo.findById.mockRejectedValue(new Error("Falha no banco"));

    const result = await useCase.execute({ id: "123" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Falha no banco");
  });
});
