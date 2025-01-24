import type { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import type { createSchema } from "../todo/schemas/create.schema";
import type { editSchema } from "../todo/schemas/edit.schema";
import * as todoRepository from "../todo/repository.todo";
import { sqlCon } from "../../common/config/kysely-config";

export async function create(req: FastifyRequest<{ Body: createSchema }>, rep: FastifyReply) {
    let date = null;
    if (req.body.notifyAt != null && req.body.notifyAt != undefined) {
        date = new Date(req.body.notifyAt);
    }
    if (!req.user || !req.user.id) {
        return rep.code(HttpStatusCode.UNAUTHORIZED).send({ error: "Unauthorized" });
    }
    const todo = {
        title: req.body.title,
        description: req.body.description,
        creatorId: req.user.id,
        notifyAt: date,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false
    };
    const insertedTodo = await todoRepository.insert(sqlCon, todo);
    return rep.code(HttpStatusCode.OK).send(insertedTodo);
}

export async function edit(req: FastifyRequest<{ Body: editSchema }>, rep: FastifyReply) {
    const data = { ...req.body };
    const editedTodo = await todoRepository.edit(sqlCon, data);
    return rep.code(HttpStatusCode.OK).send(editedTodo);
}

export async function getList(req: FastifyRequest, rep: FastifyReply) {
    try {
        const { search, sortBy, sortOrder, limit, offset, isCompleted } = req.query as Record<string, any>;

        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        const parsedOffset = offset ? parseInt(offset, 10) : 0;

        if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
            return rep.code(HttpStatusCode.BAD_REQUEST).send({
                error: "Invalid limit or offset value"
            });
        }
        const todos = await todoRepository.getList(sqlCon, {
            search,
            sortBy,
            sortOrder,
            limit: parsedLimit,
            offset: parsedOffset,
            isCompleted: isCompleted == "true" ? true : isCompleted == "false" ? false : undefined,
        });

        return rep.code(HttpStatusCode.OK).send(todos);
    } catch (error) {
        return rep.code(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
}

export async function getById(req: FastifyRequest, rep: FastifyReply) {
    const todo = await todoRepository.getById(sqlCon, req.params.id as string);
    return rep.code(HttpStatusCode.OK).send(todo);
}
