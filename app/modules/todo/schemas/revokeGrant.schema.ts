import type { FastifySchema } from "fastify";
import { z } from "zod";

export const RevokeSchema = z.object({
    userId: z.string().uuid()
});

export type revokeParamSchema = z.infer<typeof RevokeSchema>;
export const revokeParamFSchema: FastifySchema = { body: RevokeSchema };
