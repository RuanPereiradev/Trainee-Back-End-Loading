import { UpdateUserUseCase } from "../../../useCases/user/UpdateUserUseCase";
import { Result } from "../../../env/Result";
import { RoleType } from "@prisma/client";

describe("UpdateUserUseCase", () => {
  let mockRepo: any;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateUserUseCase(mockRepo);
  });

  it("deve atualizar o usuário corretamente", async () => {
    const fakeUser = {
      id: "123",
      changeName: jest.fn(),
      changeEmail: jest.fn(),
      changePassword: jest.fn(),
      changeRole: jest.fn(),
    };

    mockRepo.findById.mockResolvedValue(Result.ok(fakeUser));

    const updatedUser = { id: "123", name: "Novo Nome" };

    mockRepo.update.mockResolvedValue(Result.ok(updatedUser));

    const result = await useCase.execute({
      id: "123",
      name: "Novo Nome",
      email: "novo@email.com",
      password: "senha123",
      role: RoleType.DIRETOR,
    });

    expect(result.isSuccess).toBe(true);

    // valida se os setters foram chamados
    expect(fakeUser.changeName).toHaveBeenCalledWith("Novo Nome");
    expect(fakeUser.changeEmail).toHaveBeenCalled();
    expect(fakeUser.changePassword).toHaveBeenCalled();
    expect(fakeUser.changeRole).toHaveBeenCalledWith(RoleType.DIRETOR);

    // valida se o repo.update foi chamado
    expect(mockRepo.update).toHaveBeenCalledWith(fakeUser);
  });

  it("deve retornar erro se o usuário não existir", async () => {
    mockRepo.findById.mockResolvedValue(Result.fail("nao existe"));

    const result = await useCase.execute({
      id: "999",
      name: "xxx",
      email: "xxx",
      password: "xxx",
      role: RoleType.DIRETOR,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário não encontrado");
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockRepo.findById.mockRejectedValue(new Error("Falha no banco"));

    const result = await useCase.execute({
      id: "123",
      name: "nome",
      email: "email@test.com",
      password: "123",
      role: RoleType.DIRETOR,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Falha no banco");
  });
});
