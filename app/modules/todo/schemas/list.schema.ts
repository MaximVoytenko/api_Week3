import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    limit: z.string().min(1).optional(),
    offset: z.string().min(0).optional(),
    isCompleted: z.string().optional()
});

export type ListSchema = z.infer<typeof schema>;
export const listFSchema: FastifySchema = { querystring: schema };
