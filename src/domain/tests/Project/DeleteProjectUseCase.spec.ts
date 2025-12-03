import { Result } from "../../../env/Result";
import { DeleteProjectUseCase } from "../../../useCases/project/DeleteProjectUseCase";
import { Project } from "../../entities/Projects";
import { Sectors } from "../../entities/Sectors";
import { ProjectStatusType } from "@prisma/client";

describe("DeleteProjectUseCase", () => {
  let mockRepoProj: any;
  let useCase: DeleteProjectUseCase;

  beforeEach(() => {
    mockRepoProj = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    };

    useCase = new DeleteProjectUseCase(mockRepoProj);
  });

  it("deve deletar um projeto com sucesso", async () => {
    // 1. Criar um Sectors real
    const sector = new Sectors("TI", "Tecnologia da Informação", 1);

    // 2. Criar um Project real
    const projectResult = Project.create(
      "Projeto para Deletar",
      sector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas do projeto",
      "Descrição do projeto",
      "123"
    );

    if (projectResult.isFailure) {
      throw new Error("Falha ao criar projeto");
    }

    const fakeProj = projectResult.getValue();

    // 3. Mock do repositório
    mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
    mockRepoProj.softDelete.mockResolvedValue(Result.ok<void>());

    // 4. Executar
    const result = await useCase.execute({ id: "123" });

    // 5. Verificações
    expect(result.isSuccess).toBe(true);
    expect(mockRepoProj.findById).toHaveBeenCalledWith("123");
    expect(mockRepoProj.softDelete).toHaveBeenCalledWith("123");
  });

  it("deve retornar erro quando projeto não for encontrado", async () => {
    // Mock retornando falha
    mockRepoProj.findById.mockResolvedValue(
      Result.fail<Project>("Projeto não encontrado")
    );

    const result = await useCase.execute({ id: "999" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Projeto não encontrado");
    expect(mockRepoProj.softDelete).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando projeto for null/undefined", async () => {
    // Mock retornando sucesso mas com valor null
    mockRepoProj.findById.mockResolvedValue(Result.ok<Project>(null as any));

    const result = await useCase.execute({ id: "123" });

    expect(result.isFailure).toBe(true);
    expect(mockRepoProj.softDelete).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando softDelete falhar", async () => {
    // 1. Criar projeto real
    const sector = new Sectors("TI", "Tecnologia", 1);
    const projectResult = Project.create(
      "Projeto Teste",
      sector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      "123"
    );

    if (projectResult.isFailure) {
      throw new Error("Falha ao criar projeto");
    }

    const fakeProj = projectResult.getValue();

    // 2. Mock do repositório
    mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
    mockRepoProj.softDelete.mockResolvedValue(
      Result.fail<void>("Falha ao deletar no banco")
    );

    // 3. Executar
    const result = await useCase.execute({ id: "123" });

    // 4. Verificações
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Falha ao deletar no banco");
    expect(mockRepoProj.findById).toHaveBeenCalledWith("123");
    expect(mockRepoProj.softDelete).toHaveBeenCalledWith("123");
  });

  it("deve lidar com exceção no findById", async () => {
    mockRepoProj.findById.mockRejectedValue(new Error("Erro de conexão"));

    const result = await useCase.execute({ id: "123" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro de conexão");
    expect(mockRepoProj.softDelete).not.toHaveBeenCalled();
  });

  it("deve lidar com exceção no softDelete", async () => {
    // Criar projeto real
    const sector = new Sectors("TI", "Tecnologia", 1);
    const projectResult = Project.create(
      "Projeto Teste",
      sector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      "123"
    );

    if (projectResult.isFailure) {
      throw new Error("Falha ao criar projeto");
    }

    const fakeProj = projectResult.getValue();

    mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
    mockRepoProj.softDelete.mockRejectedValue(new Error("Erro no banco de dados"));

    const result = await useCase.execute({ id: "123" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro no banco de dados");
  });

  it("deve lidar com erro desconhecido", async () => {
    // Criar projeto real
    const sector = new Sectors("TI", "Tecnologia", 1);
    const projectResult = Project.create(
      "Projeto Teste",
      sector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      "123"
    );

    if (projectResult.isFailure) {
      throw new Error("Falha ao criar projeto");
    }

    const fakeProj = projectResult.getValue();

    mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
    mockRepoProj.softDelete.mockRejectedValue("String não é Error");

    const result = await useCase.execute({ id: "123" });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro desconhecido ao deletar projeto");
  });

  it("deve verificar chamadas em sequência correta", async () => {
    const sector = new Sectors("TI", "Tecnologia", 1);
    const projectResult = Project.create(
      "Projeto Teste",
      sector,
      ProjectStatusType.EM_ANDAMENTO,
      "Metas",
      "Descrição",
      "123"
    );

    if (projectResult.isFailure) {
      throw new Error("Falha ao criar projeto");
    }

    const fakeProj = projectResult.getValue();

    mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
    mockRepoProj.softDelete.mockResolvedValue(Result.ok<void>());

    await useCase.execute({ id: "123" });

    // Verificar ordem das chamadas
    expect(mockRepoProj.findById).toHaveBeenCalled();
    expect(mockRepoProj.softDelete).toHaveBeenCalled();
  });
});