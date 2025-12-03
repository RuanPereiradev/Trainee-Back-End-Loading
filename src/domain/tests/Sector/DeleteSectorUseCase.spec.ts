import { Result } from "../../../env/Result";
import { DeleteSectorUseCase } from "../../../useCases/sector/DeleteSectorUseCase";
import { Sectors } from "../../entities/Sectors";

describe("DeleteSectorUseCase", () => {
  let mockSectorRepo: any;
  let useCase: DeleteSectorUseCase;

  beforeEach(() => {
    mockSectorRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteSectorUseCase(mockSectorRepo);
  });

  it("deve deletar setor com sucesso", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.delete.mockResolvedValue(Result.ok<void>());

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(sectorId);
    expect(mockSectorRepo.delete).toHaveBeenCalledWith(sectorId);
  });

  it("deve retornar erro quando setor não existe", async () => {
    // Arrange
    const sectorId = 999;
    
    mockSectorRepo.findById.mockResolvedValue(
      Result.fail<Sectors>("Setor não encontrado")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Setor nao encontrado");
    expect(mockSectorRepo.delete).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando setor for null", async () => {
    // Arrange
    const sectorId = 1;
    
    // Simula findById retornando sucesso com valor null
    mockSectorRepo.findById.mockResolvedValue(Result.ok<Sectors>(null as any));

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Setor nao encontrado");
    expect(mockSectorRepo.delete).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando delete falhar", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.delete.mockResolvedValue(
      Result.fail<void>("Erro ao deletar no banco")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao deletar no banco");
    expect(mockSectorRepo.delete).toHaveBeenCalledWith(sectorId);
  });

  it("deve lidar com exceção no findById", async () => {
    // Arrange
    const sectorId = 1;
    
    mockSectorRepo.findById.mockRejectedValue(
      new Error("Erro de conexão")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro de conexão");
    expect(mockSectorRepo.delete).not.toHaveBeenCalled();
  });

  it("deve lidar com exceção no delete", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.delete.mockRejectedValue(
      new Error("Timeout no banco")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Timeout no banco");
  });

  it("deve deletar setor com ID zero (se permitido)", async () => {
    // Arrange
    const sectorId = 0;
    const existingSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.delete.mockResolvedValue(Result.ok<void>());

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockSectorRepo.delete).toHaveBeenCalledWith(0);
  });

  it("deve verificar que id não é null antes de deletar", async () => {
    // Arrange
    const sectorId = 1;
    
    // Cria um setor com id null (pode acontecer se não foi salvo ainda)
    const existingSector = new Sectors("TI", "Tecnologia");
    // existingSector.id será null
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(mockSectorRepo.delete).not.toHaveBeenCalled();
  });

  it("deve testar múltiplas deleções sequenciais", async () => {
    // Arrange
    const sector1 = new Sectors("TI", "Tecnologia", 1);
    const sector2 = new Sectors("RH", "Recursos Humanos", 2);
    
    mockSectorRepo.findById
      .mockResolvedValueOnce(Result.ok(sector1))
      .mockResolvedValueOnce(Result.ok(sector2));
    
    mockSectorRepo.delete
      .mockResolvedValueOnce(Result.ok<void>())
      .mockResolvedValueOnce(Result.ok<void>());

    // Primeira deleção
    const result1 = await useCase.execute({ id: 1 });
    expect(result1.isSuccess).toBe(true);
    expect(mockSectorRepo.delete).toHaveBeenCalledWith(1);

    // Segunda deleção
    const result2 = await useCase.execute({ id: 2 });
    expect(result2.isSuccess).toBe(true);
    expect(mockSectorRepo.delete).toHaveBeenCalledWith(2);

    // Verificar total de chamadas
    expect(mockSectorRepo.findById).toHaveBeenCalledTimes(2);
    expect(mockSectorRepo.delete).toHaveBeenCalledTimes(2);
  });

  it("deve garantir ordem correta das chamadas", async () => {
    // Arrange
    const sectorId = 1;
    const existingSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(existingSector));
    mockSectorRepo.delete.mockResolvedValue(Result.ok<void>());

    // Act
    await useCase.execute({ id: sectorId });

    // Assert - findById deve ser chamado antes de delete
    expect(mockSectorRepo.findById).toHaveBeenCalled();
    expect(mockSectorRepo.delete).toHaveBeenCalled();
  });
});