import { Result } from "../../../env/Result";
import { ISectorRepository } from "../../../repositories/interfaces/ISectorRepository";
import { CreateSectorUseCase } from "../../../useCases/sector/CreateSectorUseCase";
import { Sectors } from "../../entities/Sectors";


describe("CreateSectorUseCase", () => {
  let mockSectorRepo: jest.Mocked<ISectorRepository>;
  let useCase: CreateSectorUseCase;

  beforeEach(() => {
    mockSectorRepo = {
      findByName: jest.fn(),
      save: jest.fn(),
    } as any;

    useCase = new CreateSectorUseCase(mockSectorRepo);
  });

  it("deve criar um setor com sucesso", async () => {
    // Arrange
    const request = {
      name: "TI",
      description: "Tecnologia da Informação"
    };

    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(null)
    );

    const savedSector = new Sectors("TI", "Tecnologia da Informação", 1);
    mockSectorRepo.save.mockResolvedValue(Result.ok(savedSector));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Sectors);
    expect(result.getValue().name).toBe("TI");
    expect(result.getValue().description).toBe("Tecnologia da Informação");
    
    expect(mockSectorRepo.findByName).toHaveBeenCalledWith("TI");
    expect(mockSectorRepo.save).toHaveBeenCalled();
  });

  it("deve criar setor sem descrição", async () => {
    // Arrange
    const request = {
      name: "RH"
    };

    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(null)
    );

    const savedSector = new Sectors("RH", "", 1);
    mockSectorRepo.save.mockResolvedValue(Result.ok(savedSector));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().name).toBe("RH");
    expect(result.getValue().description).toBe("");
  });

  it("deve retornar erro quando nome já existe", async () => {
    // Arrange
    const request = {
      name: "TI",
      description: "Tecnologia"
    };

    const existingSector = new Sectors("TI", "Existente", 1);
    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(existingSector)
    );

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Name already in use");
    expect(mockSectorRepo.save).not.toHaveBeenCalled();
  });

  it("deve retornar erro quando nome é vazio (validação da entidade)", async () => {
    // Arrange
    const request = {
      name: "", // Nome vazio
      description: "Descrição"
    };

    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(null)
    );

    // Act & Assert
    // A entidade Sectors lança erro no construtor com nome vazio
    await expect(useCase.execute(request)).rejects.toThrow(
      "O nome do setor não pode ser vázio"
    );
  });

  it("deve retornar erro quando save falha", async () => {
    // Arrange
    const request = {
      name: "Marketing",
      description: "Setor de Marketing"
    };

    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(null)
    );

    mockSectorRepo.save.mockResolvedValue(
      Result.fail<Sectors>("Erro ao salvar no banco")
    );

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro ao salvar no banco");
    expect(mockSectorRepo.findByName).toHaveBeenCalledWith("Marketing");
    expect(mockSectorRepo.save).toHaveBeenCalled();
  });

  it("deve lidar com exceção no findByName", async () => {
    // Arrange
    const request = {
      name: "TI",
      description: "Tecnologia"
    };

    mockSectorRepo.findByName.mockRejectedValue(
      new Error("Erro de conexão com banco")
    );

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro de conexão com banco");
    expect(mockSectorRepo.save).not.toHaveBeenCalled();
  });

  it("deve lidar com erro desconhecido", async () => {
    // Arrange
    const request = {
      name: "TI",
      description: "Tecnologia"
    };

    mockSectorRepo.findByName.mockRejectedValue("Erro não é instância de Error");

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Erro desconhecido");
  });

  it("deve validar nome com espaços extras", async () => {
    // Arrange
    const request = {
      name: "  TI  ", // Com espaços
      description: "Tecnologia"
    };

    mockSectorRepo.findByName.mockResolvedValue(
      Result.ok<Sectors | null>(null)
    );

    const savedSector = new Sectors("TI", "Tecnologia", 1);
    mockSectorRepo.save.mockResolvedValue(Result.ok(savedSector));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isSuccess).toBe(true);
    // A entidade Sectors trim() no nome no construtor
    expect(result.getValue().name).toBe("TI");
  });
});