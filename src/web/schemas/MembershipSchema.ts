import z from "zod";

export const createMembershipSchema = z.object({
    body: z.object({
        userId: z.uuid(),
        projectId: z.uuid(),
    })
})