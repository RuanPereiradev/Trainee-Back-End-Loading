
import { ProjectStatusType, RoleType, User } from "@prisma/client";
import { RejoinProjectUseCase } from "../../../useCases/membership/RejoinProjectUseCase";
import { Sectors } from "../../entities/Sectors";
import { Project } from "../../entities/Projects";
import { Membership } from "../../entities/Membership";
import { Result } from "../../../env/Result";

describe("RejoinProjectUseCase", () => {
  let mockMembershipRepo: any;
  let mockProjectRepo: any;
  let mockUserRepo: any;
  let useCase: RejoinProjectUseCase;

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

    useCase = new RejoinProjectUseCase(
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

  it("deve permitir que usuário retorne ao projeto com sucesso", async () => {
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
    
    // Simular que o usuário havia saído
    mockMembership['_deletedAt'] = new Date();
    
    // Mock do método rejoinProject
    mockMembership.rejoinProject = jest.fn();

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
    expect(mockMembership.rejoinProject).toHaveBeenCalled();
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

  it("deve retornar erro quando membership não existe (usuário nunca esteve no projeto)", async () => {
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
      Result.ok<Membership | null>(null) // Nunca esteve no projeto
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

  it("deve retornar erro quando rejoinProject lança exceção (usuário já está ativo)", async () => {
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
    
    // Usuário já está ativo (não tem deletedAt)
    mockMembership['_deletedAt'] = null;
    
    mockMembership.rejoinProject = jest.fn().mockImplementation(() => {
      throw new Error("Usuário já está ativo no projeto");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Usuário já está ativo no projeto");
    expect(mockMembershipRepo.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando rejoinProject lança exceção (projeto arquivado)", async () => {
    const userId = "user-123";
    const projectId = "project-456";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Teste",
      mockSector,
      ProjectStatusType.CONCLUIDO, // Projeto arquivado
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;

    const mockMembership = new Membership(mockUser, mockProject);
    mockMembership['_deletedAt'] = new Date();
    
    mockMembership.rejoinProject = jest.fn().mockImplementation(() => {
      throw new Error("Não pode retornar a projeto arquivado");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Não pode retornar a projeto arquivado");
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
    mockMembership['_deletedAt'] = new Date();
    mockMembership.rejoinProject = jest.fn();

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
    expect(mockMembership.rejoinProject).toHaveBeenCalled();
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

  it("deve testar caso onde usuário é diretor retornando ao projeto", async () => {
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
    mockMembership['_deletedAt'] = new Date();
    mockMembership.rejoinProject = jest.fn();

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));
    mockMembershipRepo.update.mockResolvedValue(Result.ok<void>());

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMembership.rejoinProject).toHaveBeenCalled();
  });

  it("deve testar caso onde já existe outro diretor ativo", async () => {
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
    mockMembership['_deletedAt'] = new Date();
    
    // Simular que rejoinProject verifica se já tem diretor
    mockMembership.rejoinProject = jest.fn().mockImplementation(() => {
      throw new Error("Já existe um diretor ativo no projeto");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Já existe um diretor ativo no projeto");
  });

  it("deve testar múltiplos retornos sequenciais", async () => {
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
    mockMembership['_deletedAt'] = new Date();
    mockMembership.rejoinProject = jest.fn();

    // Primeira execução - sucesso
    mockUserRepo.findById.mockResolvedValueOnce(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValueOnce(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValueOnce(Result.ok(mockMembership));
    mockMembershipRepo.update.mockResolvedValueOnce(Result.ok<void>());

    const result1 = await useCase.execute({
      userId,
      projectId,
    });

    expect(result1.isSuccess).toBe(true);

    // Segunda execução - já está ativo
    mockMembership['_deletedAt'] = null; // Agora está ativo
    mockMembership.rejoinProject = jest.fn().mockImplementation(() => {
      throw new Error("Usuário já está ativo no projeto");
    });

    mockUserRepo.findById.mockResolvedValueOnce(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValueOnce(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValueOnce(Result.ok(mockMembership));

    const result2 = await useCase.execute({
      userId,
      projectId,
    });

    expect(result2.isFailure).toBe(true);
    expect(result2.getError()).toBe("Usuário já está ativo no projeto");
  });

  it("deve testar caso onde projeto foi excluído", async () => {
    const userId = "user-123";
    const projectId = "project-excluido";

    const mockUser = createSimpleUser({ id: userId, role: RoleType.MEMBRO });
    
    // Projeto foi excluído (soft delete)
    const mockSector = new Sectors("TI", "Tecnologia", 1);
    const mockProject = Project.create(
      "Projeto Excluído",
      mockSector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      projectId
    ).getValue()!;
    
    // Simular projeto excluído
    mockProject['_deletedAt'] = new Date();

    const mockMembership = new Membership(mockUser, mockProject);
    mockMembership['_deletedAt'] = new Date();
    
    // rejoinProject pode verificar se projeto está ativo
    mockMembership.rejoinProject = jest.fn().mockImplementation(() => {
      throw new Error("Projeto não está disponível");
    });

    mockUserRepo.findById.mockResolvedValue(Result.ok(mockUser));
    mockProjectRepo.findById.mockResolvedValue(Result.ok(mockProject));
    mockMembershipRepo.findByUserAndProject.mockResolvedValue(Result.ok(mockMembership));

    const result = await useCase.execute({
      userId,
      projectId,
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Projeto não está disponível");
  });
});