import { ProjectStatusType } from "@prisma/client";
import { RoleType } from "@prisma/client";
import { CreateMembershipUseCase } from "../../../useCases/membership/CreateMembershipUseCase";
import { User } from "../../entities/User";
import { Email } from "../../value-objects/Email";
import { Password } from "../../value-objects/Password";
import { Sectors } from "../../entities/Sectors";
import { Project } from "../../entities/Projects";
import { Membership } from "../../entities/Membership";
import { Result } from "../../../env/Result";

describe("CreateMembershipUseCase", () => {
  let mockMembershipRepo: any;
  let mockProjectRepo: any;
  let mockUserRepo: any;
  let useCase: CreateMembershipUseCase;

  beforeEach(() => {
    mockMembershipRepo = {
      findByUserAndProject: jest.fn(),
      create: jest.fn(),
      findByDirectorProject: jest.fn(),
      findByCoordenadorProject: jest.fn(),
    };

    mockProjectRepo = {
      findById: jest.fn(),
    };

    mockUserRepo = {
      findById: jest.fn(),
    };

    useCase = new CreateMembershipUseCase(
      mockMembershipRepo,
      mockProjectRepo,
      mockUserRepo
    );
  });

  // Helper para criar mock de User CORRIGIDO
  const createMockUser = (overrides: { id?: string; role?: RoleType } = {}): User => {
    const user = new User(
      "Test User",
      new Email("test@email.com"),
      new Password("hashedpassword"),
      overrides.role || RoleType.MEMBRO,
      overrides.id || "user-123"
    );
    
    return user;
  };

  // Helper para criar mock simples de User (usando type assertion)
  const createSimpleMockUser = (data: { id: string; role: RoleType }): any => {
    // Cria um objeto simples e faz type assertion
    const simpleUser = {
      id: data.id,
      role: data.role,
      // Adicione outras propriedades que Membership pode precisar
      name: "Test User",
      email: "test@email.com",
    };
    
    return simpleUser as any as User;
  };

  it("deve criar membership com sucesso para usuário comum", async () => {
    // Arrange - Use a versão simples
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.MEMBRO });

    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const mockMembership = new Membership(mockUser, mockProject);

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByCoordenadorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.create.mockResolvedValue(Result.ok(mockMembership));

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
    expect(mockMembershipRepo.findByUserAndProject).toHaveBeenCalledWith(
      userId,
      projectId
    );
    expect(mockMembershipRepo.create).toHaveBeenCalled();
  });

  it("deve criar membership para diretor quando não existe diretor no projeto", async () => {
    // Arrange
    const userId = "user-dir-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.DIRETOR });

    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const mockMembership = new Membership(mockUser, mockProject);

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByCoordenadorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.create.mockResolvedValue(Result.ok(mockMembership));

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockMembershipRepo.findByDirectorProject).toHaveBeenCalledWith(
      projectId
    );
  });

  it("deve retornar erro quando já existe diretor no projeto", async () => {
    // Arrange
    const userId = "user-dir-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.DIRETOR });

    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const existingDirector = new Membership(
      createSimpleMockUser({ id: "other-dir", role: RoleType.DIRETOR }),
      mockProject
    );

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(existingDirector)
    );

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Já existe um diretor neste projeto");
    expect(mockMembershipRepo.create).not.toHaveBeenCalled();
  });

  it("deve criar membership para coordenador quando não existe coordenador no projeto", async () => {
    // Arrange
    const userId = "user-coord-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.COORDENADOR });

    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const mockMembership = new Membership(mockUser, mockProject);

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByCoordenadorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.create.mockResolvedValue(Result.ok(mockMembership));

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockMembershipRepo.findByCoordenadorProject).toHaveBeenCalledWith(
      projectId
    );
  });

  it("deve retornar erro quando já existe coordenador no projeto", async () => {
    // Arrange
    const userId = "user-coord-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.COORDENADOR });

    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const existingCoordenador = new Membership(
      createSimpleMockUser({ id: "other-coord", role: RoleType.COORDENADOR }),
      mockProject
    );

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByCoordenadorProject.mockResolvedValue(
      Result.ok<Membership | null>(existingCoordenador)
    );

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Já existe um coordenador neste projeto");
    expect(mockMembershipRepo.create).not.toHaveBeenCalled();
  });

  // Testes adicionais importantes
  it("deve retornar erro quando userId ou projectId são vazios", async () => {
    // Teste com userId vazio
    const result1 = await useCase.execute({
      userId: "",
      projectId: "project-123",
    });
    expect(result1.isFailure).toBe(true);
    expect(result1.getError()).toBe("userId e projectId são obrigatórios");

    // Teste com projectId vazio
    const result2 = await useCase.execute({
      userId: "user-123",
      projectId: "",
    });
    expect(result2.isFailure).toBe(true);
    expect(result2.getError()).toBe("userId e projectId são obrigatórios");
  });

  it("deve retornar erro quando usuário não existe", async () => {
    const userId = "user-inexistente";
    const projectId = "project-456";

    mockUserRepo.findById.mockResolvedValue(
      Result.fail<User>("Usuário não encontrado")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário não encontrado");
  });

  it("deve retornar erro quando projeto não existe", async () => {
    const userId = "user-123";
    const projectId = "project-inexistente";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.MEMBRO });
    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));

    mockProjectRepo.findById.mockResolvedValue(
      Result.fail<Project>("Projeto não encontrado")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Projeto não encontrado");
  });

  it("deve retornar erro quando usuário já participa do projeto", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const existingMembership = new Membership(mockUser, mockProject);

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(existingMembership)
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário já participa do projeto");
  });

  it("deve retornar erro quando findByDirectorProject falha", async () => {
    const userId = "user-dir-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.DIRETOR });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.fail<Membership | null>("Erro ao buscar diretor")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao verificar diretor existente");
  });

  it("deve retornar erro quando create falha", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleMockUser({ id: userId, role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByDirectorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.findByCoordenadorProject.mockResolvedValue(
      Result.ok<Membership | null>(null)
    );
    mockMembershipRepo.create.mockResolvedValue(
      Result.fail<Membership>("Erro no banco")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao salvar membership");
  });
});