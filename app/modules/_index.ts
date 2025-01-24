import type { FastifyInstance } from "fastify";
import { todoRouter } from "./todo/router.todo";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "user" },
    { instance: todoRouter, prefix: "to-do" }
];
