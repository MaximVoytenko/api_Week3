import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import type { createSchema } from "../todo/schemas/create.schema";
import { editSchema } from "../todo/schemas/edit.schema";
import * as todoRepository from "../todo/repository.todo";
import { sqlCon } from "../../common/config/kysely-config";
import { ListSchema } from "./schemas/list.schema";

export async function create(req: FastifyRequest<{ Body: createSchema }>, rep: FastifyReply) {
    let date = null;
    if (req.body.notifyAt != null && req.body.notifyAt != undefined) {
        date = new Date(req.body.notifyAt);
    }
    const todo = {
        ...req.body,
        notifyAt: date,
        isCompleted: false
    };
    const insertedTodo = await todoRepository.insert(sqlCon, todo);
    return rep.code(HttpStatusCode.OK).send(insertedTodo);
}

export async function edit(req: FastifyRequest<{ Querystring: { id: string }; Body: editSchema }>, rep: FastifyReply) {
    const { id } = req.query;
    const data = { ...req.body };

    const editedTodo = await todoRepository.edit(sqlCon, data, id);
    return rep.code(HttpStatusCode.OK).send(editedTodo);
}

export async function getList(req: FastifyRequest<{ Querystring: ListSchema }>, rep: FastifyReply) {
    try {
        const { search, sortBy, sortOrder, limit, offset, isCompleted } = req.query as Record<string, any>;
        const todos = await todoRepository.getList(sqlCon, {
            search,
            sortBy,
            sortOrder,
            limit,
            offset,
            isCompleted: isCompleted == "true" ? true : isCompleted == "false" ? false : undefined,
        });

        return rep.code(HttpStatusCode.OK).send(todos);
    } catch (error) {
        return rep.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}

export async function getById(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const todo = await todoRepository.getById(sqlCon, id);
    return rep.code(HttpStatusCode.OK).send(todo);
}
