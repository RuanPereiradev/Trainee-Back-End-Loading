
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Result } from "../../../env/Result";
import { LoginUserUseCase } from "../../../useCases/user/LoginUserUseCase";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

// --- Mock do repositório ---
const mockUserRepository: any = {
  findByEmail: jest.fn(),
};

// --- Usuário falso que vem do repositório ---
const fakeUser = {
  id: "123",
  email: "test@test.com",
  password: { value: "hashedpass" },
  role: "DIRECTOR",
  deletedAt: null,
};

// --- Criando a instância ---
const useCase = new LoginUserUseCase(mockUserRepository);

describe("LoginUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve retornar falha se o email não existir", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(Result.fail("not found"));

    const result = await useCase.execute({
      email: "wrong@test.com",
      password: "123",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Invalid credentials");
  });

  test("deve retornar falha se o usuário estiver deletado", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      Result.ok({ ...fakeUser, deletedAt: new Date() })
    );

    const result = await useCase.execute({
      email: "test@test.com",
      password: "123",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("User invalid");
  });

  test("deve retornar falha se a senha for inválida", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(Result.ok(fakeUser));

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await useCase.execute({
      email: "test@test.com",
      password: "wrongpass",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("invalid credentials");
  });

  test("deve retornar token se tudo estiver correto", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(Result.ok(fakeUser));

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    process.env.JWT_SECRET = "secret";

    const result = await useCase.execute({
      email: "test@test.com",
      password: "123456",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBe("fake_token");
  });
});
