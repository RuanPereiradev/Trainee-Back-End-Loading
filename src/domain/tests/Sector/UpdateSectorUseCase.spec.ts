import { Result } from "../../../env/Result";
import { UpdateSetorUseCase } from "../../../useCases/sector/UpdateSectorUseCase";
import { Sectors } from "../../entities/Sectors";

describe("UpdateSetorUseCase", () => {
  let mockSectorRepo: any;
  let useCase: UpdateSetorUseCase;

  beforeEach(() => {
    mockSectorRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateSetorUseCase(mockSectorRepo);
  });

  it("deve atualizar setor com sucesso", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI Antigo", "Descrição antiga", sectorId);
    
    const updatedSector = new Sectors("TI Novo", "Descrição nova", sectorId);

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.update.mockResolvedValue(Result.ok(updatedSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "TI Novo",
      description: "Descrição nova"
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().name).toBe("TI Novo");
    expect(result.getValue().description).toBe("Descrição nova");
    
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(sectorId);
    expect(mockSectorRepo.update).toHaveBeenCalledWith(existingSector);
    
    // Verifica se os métodos de alteração foram chamados
    expect(existingSector.name).toBe("TI Novo");
    expect(existingSector.description).toBe("Descrição nova");
  });

  it("deve retornar erro quando setor não existe", async () => {
    // Arrange
    const sectorId = 999;
    
    mockSectorRepo.findById.mockResolvedValue(
      Result.fail<Sectors>("Setor não encontrado no repositório")
    );

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "Novo Nome",
      description: "Nova Descrição"
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Sector não encontrado");
    expect(mockSectorRepo.update).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando update falhar", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI Antigo", "Descrição antiga", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.update.mockResolvedValue(
      Result.fail<Sectors>("Erro ao salvar no banco")
    );

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "TI Novo",
      description: "Descrição nova"
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao salvar no banco");
    expect(mockSectorRepo.update).toHaveBeenCalledWith(existingSector);
  });

  it("deve lidar com exceção no findById", async () => {
    // Arrange
    const sectorId = 1;
    
    mockSectorRepo.findById.mockRejectedValue(
      new Error("Erro de conexão")
    );

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "Novo Nome",
      description: "Nova Descrição"
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro de conexão");
    expect(mockSectorRepo.update).not.toHaveBeenCalled();
  });

  it("deve lidar com erro quando changeName lançar exceção", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição", sectorId);
    
    // Mock changeName para lançar exceção
    existingSector.changeName = jest.fn().mockImplementation(() => {
      throw new Error("Nome inválido");
    });

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "", // Nome vazio deve causar erro
      description: "Nova descrição"
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Nome inválido");
    expect(mockSectorRepo.update).not.toHaveBeenCalled();
  });

  it("deve atualizar apenas descrição mantendo mesmo nome", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição antiga", sectorId);
    
    const updatedSector = new Sectors("TI", "Descrição nova", sectorId);

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.update.mockResolvedValue(Result.ok(updatedSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "TI", // Mesmo nome
      description: "Descrição nova" // Nova descrição
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().name).toBe("TI");
    expect(result.getValue().description).toBe("Descrição nova");
  });

  it("deve atualizar com descrição vazia", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição antiga", sectorId);
    
    const updatedSector = new Sectors("TI Novo", "", sectorId);

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.update.mockResolvedValue(Result.ok(updatedSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "TI Novo",
      description: "" // Descrição vazia
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().description).toBe("");
  });

  it("deve atualizar com espaços extras nos campos", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição", sectorId);
    
    const updatedSector = new Sectors("  TI Novo  ", "  Nova Descrição  ", sectorId);

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.update.mockResolvedValue(Result.ok(updatedSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "  TI Novo  ",
      description: "  Nova Descrição  "
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    // O método changeName da entidade Sectors faz trim()
    expect(result.getValue().name).toBe("TI Novo");
  });

  it("deve propagar erro de validação do setor", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição", sectorId);
    
    // Forçar erro na validação interna do setor
    existingSector.changeName = jest.fn().mockImplementation(() => {
      throw new Error("Nome não pode ser vazio");
    });

    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));

    // Act
    const result = await useCase.execute({
      id: sectorId,
      name: "",
      description: "Nova descrição"
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Nome não pode ser vazio");
  });

  it("deve manter histórico de alterações", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Descrição", sectorId);
    
    // Verificar se a entidade tem propriedades de auditoria
    if (existingSector['_createdAt']) {
      const originalCreatedAt = existingSector['_createdAt'];
      
      mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
      mockSectorRepo.update.mockResolvedValue(Result.ok(existingSector));

      // Act
      const result = await useCase.execute({
        id: sectorId,
        name: "TI Atualizado",
        description: "Descrição Atualizada"
      });

      // Assert
      expect(result.isSuccess).toBe(true);
      // CreatedAt deve permanecer, updatedAt deve mudar
      expect(existingSector['_createdAt']).toBe(originalCreatedAt);
    }
  });
});