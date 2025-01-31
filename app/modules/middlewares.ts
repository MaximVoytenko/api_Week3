import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../common/config/kysely-config";
import { HttpStatusCode } from "../common/enum/http-status-code";
import { getCreatorId, getGrants } from "./todo/repository.todo";

export async function isOwnerMiddleware(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const todo = await getCreatorId(sqlCon, id);

    if (!todo) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({ message: "Task not found" });
    }
    if (todo.creatorId !== req.user.id) {
        return rep.code(HttpStatusCode.FORBIDDEN).send("You do not have permission to edit or delete this todo");
    }

    return;
}

export async function accessGrantedMiddleware(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const todo1 = await getCreatorId(sqlCon, id);

    if (!todo1 || todo1.creatorId === req.user.id) {
        return;
    }
    const todo = await getGrants(sqlCon, id);

    for (let i = 0; i < todo.length; i++) {
        if (todo[i].userId === req.user.id) {
            return;
        }
    }

    return rep.code(HttpStatusCode.FORBIDDEN).send("You do not have permission this todo");
}
