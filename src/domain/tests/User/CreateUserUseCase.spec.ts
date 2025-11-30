import { CreateUserUseCase } from "../../../useCases/user/CreateUserUseCase";
import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { Result } from "../../../env/Result";
import { User } from "../../../domain/entities/User";
import { RoleType } from "@prisma/client";

// bcrypt precisa ser mockado porque usamos hash
jest.mock("bcryptjs", () => ({
    hash: jest.fn(async () => "hashed_password")
}));

describe("CreateUserUseCase", () => {

    // --- REPOSITÓRIO FALSO PARA OS TESTES ---
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            findByIdAny: jest.fn(),
            listPaginated: jest.fn(),
        };

        createUserUseCase = new CreateUserUseCase(mockUserRepository);
    });

    // ==================================================
    // 1 - NÃO PERMITE CRIAR USUÁRIO SE O EMAIL JÁ EXISTE
    // ==================================================
    it("deve retornar erro se o email já estiver em uso", async () => {
        // findByEmail retorna SUCESSO → significa que encontrou um usuário
        mockUserRepository.findByEmail.mockResolvedValue(Result.ok(new User(
            "teste", { value: "email@test.com" } as any, { value: "123" } as any, RoleType.DIRETOR
        )));

        const result = await createUserUseCase.execute({
            name: "Ruan",
            email: "teste@test.com",
            password: "123456",
            role: RoleType.DIRETOR
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Email already in use");
    });

    // ==================================================
    // 2 - CRIAÇÃO COM SUCESSO
    // ==================================================
    it("deve criar um usuário corretamente quando tudo estiver certo", async () => {
        // findByEmail retorna FALHA → email não existe → OK pra criar
        mockUserRepository.findByEmail.mockResolvedValue(Result.fail("not found"));

        // mock do save retorna usuário salvo
        mockUserRepository.save.mockImplementation(async (user: User) => {
            return Result.ok(user);
        });

        const result = await createUserUseCase.execute({
            name: "Ruan",
            email: "ruan@mail.com",
            password: "123456",
            role: RoleType.DIRETOR
        });

        expect(result.isSuccess).toBe(true);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(result.getValue()?.name).toBe("Ruan");
    });

    // ==================================================
    // 3 - ERRO INTERNO (ex: o save deu erro)
    // ==================================================
    it("deve retornar erro caso o repositório lance exceção", async () => {
        mockUserRepository.findByEmail.mockResolvedValue(Result.fail("not found"));

        mockUserRepository.save.mockRejectedValue(new Error("DB error"));

        const result = await createUserUseCase.execute({
            name: "Teste",
            email: "erro@mail.com",
            password: "senha",
            role: RoleType.DIRETOR
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("DB error");
    });
});
