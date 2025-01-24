import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1).max(127),
    description: z.string(),
    notifyAt: z.string().optional(),
    isCompleted: z.boolean().optional()
});

export type editSchema = z.infer<typeof schema>;
export const editFSchema: FastifySchema = { body: schema };
