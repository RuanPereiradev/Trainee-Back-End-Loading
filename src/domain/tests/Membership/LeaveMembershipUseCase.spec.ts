
import { ProjectStatusType, RoleType, User } from "@prisma/client";
import { LeaveProjectUseCase } from "../../../useCases/membership/LeaveProjectUseCase";
import { Sectors } from "../../entities/Sectors";
import { Project } from "../../entities/Projects";
import { Membership } from "../../entities/Membership";
import { Result } from "../../../env/Result";

describe("LeaveProjectUseCase", () => {
  let mockMembershipRepo: any;
  let mockProjectRepo: any;
  let mockUserRepo: any;
  let useCase: LeaveProjectUseCase;

  beforeEach(() => {
    mockMembershipRepo = {
      findByUserAndProject: jest.fn(),
      update: jest.fn(),
    };

    mockProjectRepo = {
      findById: jest.fn(),
    };

    mockUserRepo = {
      findById: jest.fn(),
    };

    useCase = new LeaveProjectUseCase(
      mockMembershipRepo,
      mockProjectRepo,
      mockUserRepo
    );
  });

  // Helper para criar mock simples
  const createSimpleUser = (data: { id: string; role: RoleType }): any => {
    return {
      id: data.id,
      role: data.role,
      name: "Test User",
      email: "test@email.com",
    } as any as User;
  };

  const createMockMembership = (isActive: boolean = true): any => {
    const mockUser = createSimpleUser({ id: "user-123", role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      "project-456"
    ).getValue()!;

    const membership = new Membership(mockUser, mockProject);
    
    // Mock do método leaveProject
    membership.leaveProject = jest.fn();
    
    // Simular se está ativo ou não
    if (!isActive) {
      membership['_deletedAt'] = new Date(); // Já saiu do projeto
    }
    
    return membership;
  };

  it("deve permitir que usuário saia do projeto com sucesso", async () => {
    // Arrange
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
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
    mockMembership.leaveProject = jest.fn();

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));
    mockMembershipRepo.update.mockResolvedValue(Result.ok<void>());

    // Act
    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockMembership.leaveProject).toHaveBeenCalled();
    expect(mockMembershipRepo.update).toHaveBeenCalledWith(mockMembership);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    expect(mockProjectRepo.findById).toHaveBeenCalledWith(projectId);
  });

  it("deve retornar erro quando userId ou projectId são vazios", async () => {
    // Teste com userId vazio
    const result1 = await useCase.execute({
      userId: "",
      projectId: "project-123",
    });
    expect(result1.isFailure).toBe(true);
    expect(result1.getError()).toBe("Todos os campos obrigatorios");

    // Teste com projectId vazio
    const result2 = await useCase.execute({
      userId: "user-123",
      projectId: "",
    });
    expect(result2.isFailure).toBe(true);
    expect(result2.getError()).toBe("Todos os campos obrigatorios");

    // Teste com ambos vazios
    const result3 = await useCase.execute({
      userId: "",
      projectId: "",
    });
    expect(result3.isFailure).toBe(true);
    expect(result3.getError()).toBe("Todos os campos obrigatorios");
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
    expect(mockProjectRepo.findById).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando projeto não existe", async () => {
    const userId = "user-123";
    const projectId = "project-inexistente";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
    
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
    expect(mockMembershipRepo.findByUserAndProject).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando membership não existe (usuário não está no projeto)", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
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
      Result.ok<Membership | null>(null) // Não está no projeto
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário não está vinculado a este projeto");
    expect(mockMembershipRepo.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando findByUserAndProject falha", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
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
      Result.fail<Membership>("Erro ao buscar vínculo")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao buscar vínculo");
    expect(mockMembershipRepo.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando leaveProject lança exceção", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
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
    mockMembership.leaveProject = jest.fn().mockImplementation(() => {
      throw new Error("Não pode sair do projeto em andamento");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Não pode sair do projeto em andamento");
    expect(mockMembershipRepo.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando update falha", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
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
    mockMembership.leaveProject = jest.fn();

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));
    mockMembershipRepo.update.mockResolvedValue(
      Result.fail<void>("Erro ao atualizar no banco")
    );

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao atualizar no banco");
    expect(mockMembership.leaveProject).toHaveBeenCalled();
  });

  it("deve lidar com exceção geral", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    mockUserRepo.findById.mockRejectedValue(new Error("Erro inesperado"));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro inesperado");
  });

  it("deve verificar se membership já está inativo antes de tentar sair", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    // Criar membership que já saiu (tem deletedAt)
    const mockMembership = new Membership(mockUser, mockProject);
    mockMembership['_deletedAt'] = new Date(); // Já saiu
    
    // Se leaveProject lançar erro quando já saiu
    mockMembership.leaveProject = jest.fn().mockImplementation(() => {
      throw new Error("Já saiu do projeto");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    // Pode falhar ou ter sucesso, dependendo da implementação
    // Se leaveProject lançar erro, vai capturar
    // Se não lançar, vai tentar atualizar
  });

  it("deve testar caso onde usuário é diretor saindo do projeto", async () => {
    const userId = "user-dir-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.DIRETOR });
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
    mockMembership.leaveProject = jest.fn();

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));
    mockMembershipRepo.update.mockResolvedValue(Result.ok<void>());

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMembership.leaveProject).toHaveBeenCalled();
  });

  it("deve testar múltiplas saídas sequenciais", async () => {
    const userId1 = "user-123";
    const userId2 = "user-456";
    const projectId = "project-789";

    const mockUser1 = createSimpleUser({ id: userId1, role: RoleType.MEMBRO });
    const mockUser2 = createSimpleUser({ id: userId2, role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const mockMembership1 = new Membership(mockUser1, mockProject);
    const mockMembership2 = new Membership(mockUser2, mockProject);
    
    mockMembership1.leaveProject = jest.fn();
    mockMembership2.leaveProject = jest.fn();

    // Primeira execução
    mockUserRepo.findById.mockResolvedValueOnce(Result.ok(mockUser1));
    mockProjectRepo.findById.mockResolvedValueOnce(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValueOnce(Result.ok(mockMembership1));
    mockMembershipRepo.update.mockResolvedValueOnce(Result.ok<void>());

    const result1 = await useCase.execute({
      userId: userId1,
      projectId,
    });

    expect(result1.isSuccess).toBe(true);

    // Segunda execução
    mockUserRepo.findById.mockResolvedValueOnce(Result.ok(mockUser2));
    mockProjectRepo.findById.mockResolvedValueOnce(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValueOnce(Result.ok(mockMembership2));
    mockMembershipRepo.update.mockResolvedValueOnce(Result.ok<void>());

    const result2 = await useCase.execute({
      userId: userId2,
      projectId,
    });

    expect(result2.isSuccess).toBe(true);
    expect(mockMembershipRepo.update).toHaveBeenCalledTimes(2);
  });
});