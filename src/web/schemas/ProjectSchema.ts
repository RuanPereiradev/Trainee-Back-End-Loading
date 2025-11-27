import z from "zod";

export const createProjectSchema = z.object({
    body: z.object({
        name:   z.string().min(1),
        description: z.string().min(1),
        sector: z.string().min(1),
        status: z.enum(["PLANEJADO", "EM_ANDAMENTO", "PAUSADO", "CONCLUIDO"]),
        goals: z.string().min(1)
    })
})