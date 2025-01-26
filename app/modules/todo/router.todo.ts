import type { FastifyInstance } from "fastify";
import * as todoController from "./controller.todo";
import { createFSchema } from "./schemas/create.schema";
import { editFSchema } from "./schemas/edit.schema";
import { listFSchema } from "./schemas/list.schema";

export const todoRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createFSchema }, todoController.create);
    app.patch("/", { schema: editFSchema }, todoController.edit);
    app.get("/:id", {}, todoController.getById);
    app.get("/", { schema: listFSchema }, todoController.getList);
};
