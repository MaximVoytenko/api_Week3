import type { FastifySchema } from "fastify";
import { z } from "zod";

export const paramSchema = z.object({
    id: z.string().uuid()
});

export const schema = z.object({
    title: z.string().min(1).max(127).optional(),
    description: z.string().optional(),
    notifyAt: z.coerce.date().optional(),
    isCompleted: z.boolean().optional()
});

export type editSchema = z.infer<typeof schema>;
export type paramsSchema = z.infer<typeof paramSchema>;
export const editFSchema: FastifySchema = { body: schema };
