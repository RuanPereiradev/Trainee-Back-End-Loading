import {z} from "zod"

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(1).describe("Nome do usuário"),
        email: z.email().describe("Email do usuário"),
        password: z.string().min(6).describe("senha do usuário"),
        role: z.enum(["DIRETOR", "COORDENADOR", "MEMBRO"]).describe("Role: DIRECTOR, COORDENADOR, MEMBRO")
    })
});