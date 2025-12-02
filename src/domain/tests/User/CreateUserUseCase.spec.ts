import { CreateUserUseCase } from "../../../useCases/user/CreateUserUseCase";
import { Result } from "../../../env/Result";
import { RoleType } from "@prisma/client";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { User } from "../../../domain/entities/User";

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-pass")
}));

describe("CreateUserUseCase", () => {
  let mockRepo: any;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    useCase = new CreateUserUseCase(mockRepo);
  });

  it("deve criar usuário corretamente", async () => {
    // email ainda não existe
    mockRepo.findByEmail.mockResolvedValue(Result.fail("not found"));

    const fakeUser = {
      id: "1",
      name: "User Test",
      email: new Email("email@test.com"),
      password: new Password("hashed-pass"),
      role: RoleType.DIRETOR
    };

    mockRepo.save.mockResolvedValue(Result.ok(fakeUser));

    const result = await useCase.execute({
      name: "User Test",
      email: "email@test.com",
      password: "123456",
      role: RoleType.DIRETOR
    });

    expect(result.isSuccess).toBe(true);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("email@test.com");
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it("deve retornar erro se o email já estiver em uso", async () => {
    mockRepo.findByEmail.mockResolvedValue(Result.ok("existing"));

    const result = await useCase.execute({
      name: "User Test",
      email: "email@test.com",
      password: "123",
      role: RoleType.DIRETOR
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Email already in use");
  });

  it("deve retornar erro se o repositório lançar exceção", async () => {
    mockRepo.findByEmail.mockRejectedValue(new Error("db error"));

    const result = await useCase.execute({
      name: "User Test",
      email: "email@test.com",
      password: "123",
      role: RoleType.DIRETOR
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("db error");
  });
});
