import type { FastifyInstance } from "fastify";
import { accessGrantedMiddleware, isOwnerMiddleware } from "../middlewares";
import * as todoController from "./controller.todo";
import { createFSchema } from "./schemas/create.schema";
import { editFSchema, paramSchema } from "./schemas/edit.schema";
import { grantParamFSchema } from "./schemas/grantAccess.schema";
import { listFSchema } from "./schemas/list.schema";
import { revokeParamFSchema } from "./schemas/revokeGrant.schema";

export const todoRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createFSchema }, todoController.create);
    app.patch("/:id", { schema: editFSchema, preHandler: isOwnerMiddleware }, todoController.edit);
    app.get("/:id", { preHandler: accessGrantedMiddleware }, todoController.getById);
    app.get("/", { schema: listFSchema }, todoController.getList);
    app.delete("/:id", { schema: { params: paramSchema }, preHandler: isOwnerMiddleware }, todoController.deleteTodo);
    app.post("/:id/share", { schema: grantParamFSchema, preHandler: isOwnerMiddleware }, todoController.grantAccess);
    app.delete("/:id/revoke", { schema: revokeParamFSchema, preHandler: isOwnerMiddleware }, todoController.revokeAccess);
    app.get("/:id/listGrants", { preHandler: isOwnerMiddleware }, todoController.listGrants);
};
