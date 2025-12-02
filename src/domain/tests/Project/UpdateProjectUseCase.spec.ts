import { ProjectStatusType } from "@prisma/client";
import { Result } from "../../../env/Result";
import { UpdateProjectUseCase } from "../../../useCases/project/UpdateProjectUseCase";
import { Sectors } from "../../entities/Sectors";
import { Project } from "../../entities/Projects";

describe("UpdateProjectUseCase", () => {
    let mockRepoProj: any;
    let useCase: UpdateProjectUseCase;

    beforeEach(() => {
        mockRepoProj = {
            findById: jest.fn(),
            update: jest.fn(),
        };

        useCase = new UpdateProjectUseCase(mockRepoProj);
    });

    // Teste de diagnóstico primeiro
    it("DEBUG: verificar comportamento do changeName", async () => {
        // Criar Sectors
        const sector = new Sectors("TI", "Tecnologia", 1);
        
        // Criar Project
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

        const project = projectResult.getValue();
        
        // Teste 1: Nome válido
        const validResult = project.changeName("Novo Nome");
        console.log("Valid result:", validResult);
        console.log("Is success?", validResult?.isSuccess);
        
        // Teste 2: Nome vazio
        const invalidResult = project.changeName("");
        console.log("Invalid result:", invalidResult);
        console.log("Is failure?", invalidResult?.isFailure);
        console.log("Error message:", invalidResult?.getError?.());
        
        // Verificações
        expect(invalidResult).toBeDefined();
        expect(invalidResult.isFailure).toBe(true);
        expect(invalidResult.getError()).toBe("O nome não pode ser vazio");
    });

    it("deve atualizar o projeto corretamente com todos os campos", async () => {
        // 1. Criar um Sectors real
        const initialSector = new Sectors(
            "TI",
            "Tecnologia da Informação",
            1
        );

        const newSector = new Sectors(
            "RH",
            "Recursos Humanos",
            2
        );

        // 2. Criar um Project real
        const projectResult = Project.create(
            "Projeto Antigo",
            initialSector,
            ProjectStatusType.EM_ANDAMENTO,
            "Meta antiga",
            "Descrição antiga",
            "123"
        );

        if (projectResult.isFailure) {
            throw new Error("Falha ao criar projeto mock");
        }

        const fakeProj = projectResult.getValue();

        // 3. Mock do repositório
        mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
        
        // Criar projeto atualizado
        const updatedProjectResult = Project.create(
            "Novo Nome",
            newSector,
            ProjectStatusType.PAUSADO,
            "nova meta",
            "Descrição nova",
            "123"
        );

        if (updatedProjectResult.isFailure) {
            throw new Error("Falha ao criar projeto atualizado mock");
        }

        const updatedProject = updatedProjectResult.getValue();
        mockRepoProj.update.mockResolvedValue(Result.ok(updatedProject));

        // 4. Executar
        const result = await useCase.execute({
            id: "123",
            name: "Novo Nome",
            status: ProjectStatusType.PAUSADO,
            description: "Descrição nova",
            sector: newSector,
            goals: "nova meta"
        });

        // 5. Verificações
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().name).toBe("Novo Nome");
        expect(result.getValue().sector.name).toBe("RH");
        expect(result.getValue().status).toBe(ProjectStatusType.PAUSADO);
        
        expect(mockRepoProj.findById).toHaveBeenCalledWith("123");
        expect(mockRepoProj.update).toHaveBeenCalledWith(fakeProj);
    });

    it("deve retornar erro quando changeName falhar", async () => {
        // Usar mock para ter controle total
        const mockProject = {
            id: "123",
            name: "Projeto Teste",
            changeName: jest.fn().mockReturnValue(
                Result.fail<void>("O nome não pode ser vazio")
            ),
            // Adicione outros métodos se necessário
            changeDescription: jest.fn(),
            changeSector: jest.fn(),
            changeStatus: jest.fn(),
            changeGoals: jest.fn()
        };

        mockRepoProj.findById.mockResolvedValue(Result.ok(mockProject));

        const result = await useCase.execute({
            id: "123",
            name: "", // Nome vazio
            description: "Nova descrição"
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("O nome não pode ser vazio");
        expect(mockProject.changeName).toHaveBeenCalledWith("");
        expect(mockRepoProj.update).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando projeto não for encontrado", async () => {
        mockRepoProj.findById.mockResolvedValue(
            Result.fail<Project>("Projeto não encontrado")
        );

        const result = await useCase.execute({
            id: "999",
            name: "Novo Nome"
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Projeto não encontrado");
        expect(mockRepoProj.update).not.toHaveBeenCalled();
    });

    it("deve atualizar apenas alguns campos", async () => {
        // Criar Sectors
        const sector = new Sectors("TI", "Tecnologia", 1);
        
        // Criar Project
        const projectResult = Project.create(
            "Projeto Antigo",
            sector,
            ProjectStatusType.EM_ANDAMENTO,
            "Metas antigas",
            "Descrição antiga",
            "123"
        );

        if (projectResult.isFailure) {
            throw new Error("Falha ao criar projeto");
        }

        const fakeProj = projectResult.getValue();
        
        // Mock do repositório
        mockRepoProj.findById.mockResolvedValue(Result.ok(fakeProj));
        
        // Projeto atualizado (apenas nome alterado)
        const updatedProjectResult = Project.create(
            "Apenas Nome Alterado",
            sector,
            ProjectStatusType.EM_ANDAMENTO,
            "Metas antigas",
            "Descrição antiga",
            "123"
        );

        if (updatedProjectResult.isFailure) {
            throw new Error("Falha ao criar projeto atualizado");
        }

        const updatedProject = updatedProjectResult.getValue();
        mockRepoProj.update.mockResolvedValue(Result.ok(updatedProject));

        // Executar apenas com nome
        const result = await useCase.execute({
            id: "123",
            name: "Apenas Nome Alterado"
        });

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().name).toBe("Apenas Nome Alterado");
        expect(result.getValue().description).toBe("Descrição antiga");
        expect(mockRepoProj.update).toHaveBeenCalled();
    });

    it("deve lidar com exceção do repositório", async () => {
        // Usar mock simplificado
        const mockProject = {
            id: "123",
            name: "Projeto Teste",
            changeName: jest.fn().mockReturnValue(Result.ok<void>()),
            changeDescription: jest.fn(),
            changeSector: jest.fn(),
            changeStatus: jest.fn(),
            changeGoals: jest.fn()
        };

        mockRepoProj.findById.mockResolvedValue(Result.ok(mockProject));
        mockRepoProj.update.mockRejectedValue(new Error("Erro de conexão com banco"));

        const result = await useCase.execute({
            id: "123",
            name: "Novo Nome"
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Erro de conexão com banco");
    });

    it("deve retornar erro quando changeSector falhar", async () => {
        const mockProject = {
            id: "123",
            name: "Projeto Teste",
            changeName: jest.fn().mockReturnValue(Result.ok<void>()),
            changeSector: jest.fn().mockReturnValue(
                Result.fail<void>("Setor inválido")
            ),
            changeDescription: jest.fn(),
            changeStatus: jest.fn(),
            changeGoals: jest.fn()
        };

        const mockSector = {
            id: 2,
            name: "RH",
            description: "Recursos Humanos"
        };

        mockRepoProj.findById.mockResolvedValue(Result.ok(mockProject));

        const result = await useCase.execute({
            id: "123",
            name: "Novo Nome",
            sector: mockSector as any
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Setor inválido");
        expect(mockProject.changeSector).toHaveBeenCalledWith(mockSector);
        expect(mockRepoProj.update).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando changeDescription falhar", async () => {
        const mockProject = {
            id: "123",
            name: "Projeto Teste",
            changeName: jest.fn().mockReturnValue(Result.ok<void>()),
            changeDescription: jest.fn().mockReturnValue(
                Result.fail<void>("Descrição inválida")
            ),
            changeSector: jest.fn(),
            changeStatus: jest.fn(),
            changeGoals: jest.fn()
        };

        mockRepoProj.findById.mockResolvedValue(Result.ok(mockProject));

        const result = await useCase.execute({
            id: "123",
            name: "Novo Nome",
            description: "" // Descrição vazia
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Descrição inválida");
        expect(mockProject.changeDescription).toHaveBeenCalledWith("");
        expect(mockRepoProj.update).not.toHaveBeenCalled();
    });

    it("deve retornar erro quando update do repositório falhar", async () => {
        const mockProject = {
            id: "123",
            name: "Projeto Teste",
            changeName: jest.fn().mockReturnValue(Result.ok<void>()),
            changeDescription: jest.fn().mockReturnValue(Result.ok<void>()),
            changeSector: jest.fn(),
            changeStatus: jest.fn(),
            changeGoals: jest.fn()
        };

        mockRepoProj.findById.mockResolvedValue(Result.ok(mockProject));
        mockRepoProj.update.mockResolvedValue(
            Result.fail<Project>("Falha ao salvar no banco")
        );

        const result = await useCase.execute({
            id: "123",
            name: "Novo Nome",
            description: "Nova descrição"
        });

        expect(result.isFailure).toBe(true);
        expect(result.getError()).toBe("Falha ao salvar no banco");
        expect(mockRepoProj.update).toHaveBeenCalledWith(mockProject);
    });
});