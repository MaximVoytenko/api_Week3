import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    limit: z.coerce.number().min(1).optional(),
    offset: z.coerce.number().min(0).optional(),
    isCompleted: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional()
});

export type ListSchema = z.infer<typeof schema>;
export const listFSchema: FastifySchema = { querystring: schema };
