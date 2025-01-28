import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as todoRepository from "../todo/repository.todo";
import type { createSchema } from "../todo/schemas/create.schema";
import { editSchema, paramsSchema } from "../todo/schemas/edit.schema";
import { ListSchema } from "./schemas/list.schema";

export async function create(req: FastifyRequest<{ Body: createSchema }>, rep: FastifyReply) {
    let date = null;
    if (req.body.notifyAt != null && req.body.notifyAt != undefined) {
        date = new Date(req.body.notifyAt);
    }
    const todo = {
        ...req.body,
        creatorId: req.user.id,
        notifyAt: date,
        isCompleted: false
    };
    const insertedTodo = await todoRepository.insert(sqlCon, todo);
    return rep.code(HttpStatusCode.OK).send(insertedTodo);
}

export async function edit(req: FastifyRequest<{ Querystring: paramsSchema; Body: editSchema }>, rep: FastifyReply) {
    const editedTodo = await todoRepository.edit(sqlCon, { ...req.body }, req.query.id);
    return rep.code(HttpStatusCode.OK).send(editedTodo);
}

export async function getList(req: FastifyRequest<{ Querystring: ListSchema }>, rep: FastifyReply) {
    const todos = await todoRepository.getList(sqlCon, req.query);
    return rep.code(HttpStatusCode.OK).send(todos);
}

export async function getById(req: FastifyRequest<{ Params: paramsSchema }>, rep: FastifyReply) {
    const todo = await todoRepository.getById(sqlCon, req.params.id);
    if (!todo) {
        return rep.code(HttpStatusCode.NOT_FOUND).send("Not Found");
    }
    return rep.code(HttpStatusCode.OK).send(todo);
}
