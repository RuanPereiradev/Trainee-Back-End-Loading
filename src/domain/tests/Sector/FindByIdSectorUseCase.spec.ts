import { Result } from "../../../env/Result";
import { ISectorRepository } from "../../../repositories/interfaces/ISectorRepository";
import { FindSectorByIdUseCase } from "../../../useCases/sector/FindSectorByIdUseCase";
import { Sectors } from "../../entities/Sectors";

describe("FindSectorByIdUseCase", () => {
  let mockSectorRepo: jest.Mocked<ISectorRepository>;
  let useCase: FindSectorByIdUseCase;

  beforeEach(() => {
    mockSectorRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new FindSectorByIdUseCase(mockSectorRepo);
  });

  it("deve encontrar setor por ID com sucesso", async () => {
    // Arrange
    const sectorId = 1;
    const mockSector = new Sectors("TI", "Tecnologia da Informação", sectorId);

    mockSectorRepo.findById.mockResolvedValue(Result.ok(mockSector));

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Sectors);
    expect(result.getValue().id).toBe(sectorId);
    expect(result.getValue().name).toBe("TI");
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(sectorId);
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
    expect(result.getError()).toBe("Setor não encontrado");
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(sectorId);
  });

  it("deve lidar com exceção no repositório", async () => {
    // Arrange
    const sectorId = 1;
    
    mockSectorRepo.findById.mockRejectedValue(
      new Error("Erro de conexão com banco")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro de conexão com banco");
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(sectorId);
  });

  it("deve lidar com erro desconhecido", async () => {
    // Arrange
    const sectorId = 1;
    
    mockSectorRepo.findById.mockRejectedValue("Erro não é instância de Error");

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro desconhecido ao buscar por ID");
  });

  it("deve encontrar setor com ID zero (caso especial)", async () => {
    // Arrange
    const sectorId = 0;
    const mockSector = new Sectors("TI", "Tecnologia", sectorId);
    
    mockSectorRepo.findById.mockResolvedValue(Result.ok(mockSector));

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe(0);
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(0);
  });

  it("deve encontrar setor com ID negativo (se permitido pelo sistema)", async () => {
    // Arrange
    const sectorId = -1;
    
    mockSectorRepo.findById.mockResolvedValue(
      Result.fail<Sectors>("ID inválido")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("ID inválido");
  });

  it("deve propagar erro específico do repositório", async () => {
    // Arrange
    const sectorId = 1;
    const specificError = "Violação de chave única";
    
    mockSectorRepo.findById.mockResolvedValue(
      Result.fail<Sectors>(specificError)
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(specificError);
  });

  it("deve validar múltiplas buscas sequenciais", async () => {
    // Arrange
    const sector1 = new Sectors("TI", "Tecnologia", 1);
    const sector2 = new Sectors("RH", "Recursos Humanos", 2);
    
    mockSectorRepo.findById
      .mockResolvedValueOnce(Result.ok(sector1))
      .mockResolvedValueOnce(Result.ok(sector2));

    // Act - Primeira busca
    const result1 = await useCase.execute({ id: 1 });
    
    // Assert - Primeira busca
    expect(result1.isSuccess).toBe(true);
    expect(result1.getValue().name).toBe("TI");

    // Act - Segunda busca
    const result2 = await useCase.execute({ id: 2 });
    
    // Assert - Segunda busca
    expect(result2.isSuccess).toBe(true);
    expect(result2.getValue().name).toBe("RH");

    // Verificar chamadas
    expect(mockSectorRepo.findById).toHaveBeenCalledTimes(2);
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(1);
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(2);
  });

  it("deve testar ID como número decimal (se for convertido)", async () => {
    // Arrange
    const sectorId = 1.5; // ID decimal
    
    mockSectorRepo.findById.mockResolvedValue(
      Result.fail<Sectors>("ID deve ser inteiro")
    );

    // Act
    const result = await useCase.execute({ id: sectorId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(mockSectorRepo.findById).toHaveBeenCalledWith(1.5);
  });
});