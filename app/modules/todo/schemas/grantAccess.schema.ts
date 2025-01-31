import type { FastifySchema } from "fastify";
import { z } from "zod";

export const Schema = z.object({
    userId: z.string().uuid()
});

export type grantParamSchema = z.infer<typeof Schema>;
export const grantParamFSchema: FastifySchema = { body: Schema };
