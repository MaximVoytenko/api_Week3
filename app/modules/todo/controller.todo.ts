import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { sendEmail } from "../../common/utils/email"; // Утилита для отправки email
import * as todoRepository from "../todo/repository.todo";
import type { createSchema } from "../todo/schemas/create.schema";
import { editSchema, paramsSchema } from "../todo/schemas/edit.schema";
import * as userRepository from "../user/repository.user";
import { grantParamSchema } from "./schemas/grantAccess.schema";
import { ListSchema } from "./schemas/list.schema";
import { revokeParamSchema } from "./schemas/revokeGrant.schema";

export async function create(req: FastifyRequest<{ Body: createSchema }>, rep: FastifyReply) {
    const todo = {
        ...req.body,
        creatorId: req.user.id,
        isCompleted: false
    };
    const insertedTodo = await todoRepository.insert(sqlCon, todo);
    return rep.code(HttpStatusCode.OK).send(insertedTodo);
}

export async function edit(req: FastifyRequest<{ Params: { id: string }; Body: editSchema }>, rep: FastifyReply) {
    const todo = await todoRepository.getById(sqlCon, req.params.id);
    if (!todo) return rep.code(HttpStatusCode.NOT_FOUND).send("Task not found");
    const updatedTodo = await todoRepository.edit(sqlCon, req.body, req.params.id);
    return rep.send(updatedTodo);
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

export async function deleteTodo(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    await todoRepository.deleteById(sqlCon, req.params.id);
    return rep.code(HttpStatusCode.NO_CONTENT).send();
}

export async function grantAccess(req: FastifyRequest<{ Body: grantParamSchema; Params: { id: string } }>, rep: FastifyReply) {
    const entity = {
        userId: req.body.userId,
        ObjectivesId: req.params.id
    };

    const user = await userRepository.getById(sqlCon, req.body.userId);
    if (!user) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({ message: "User not found" });
    }

    const data = await todoRepository.grantAccess(sqlCon, entity);

    try {
        await sendEmail({
            to: user.email,
            subject: "Доступ к заметке",
            text: `Вам был предоставлен доступ к заметке с ID: ${req.params.id}.`,
            html: `<p>Вам был предоставлен доступ к заметке с ID: <strong>${req.params.id}</strong>.</p>`
        });
    } catch (error) {
        console.error("Failed to send email:", error);
    }

    return rep.code(HttpStatusCode.OK).send(data);
}

export async function revokeAccess(req: FastifyRequest<{ Body: revokeParamSchema; Params: { id: string } }>, rep: FastifyReply) {
    const entity = {
        userId: req.body.userId,
        ObjectivesId: req.params.id
    };

    await todoRepository.revokeAccess(sqlCon, entity);
    return rep.code(HttpStatusCode.OK).send({ message: "Access revoked successfully" });
}

export async function listGrants(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const toDoId = req.params.id;
    const data = await todoRepository.listGrants(sqlCon, toDoId);
    return rep.code(HttpStatusCode.OK).send(data);
}
