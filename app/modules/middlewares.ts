import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../common/config/kysely-config";
import { AccessDeniedException } from "../common/exceptions/AccessDeniedException";
import { getCreatorId, getGrants } from "./todo/repository.todo";

export async function isOwnerMiddleware(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const todo = await getCreatorId(sqlCon, id);

    if (todo && todo.creatorId !== req.user.id) {
        throw new AccessDeniedException();
    }
}

export async function accessGrantedMiddleware(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const todo = await getGrants(sqlCon, id);

    for (let i = 0; i < todo.length; i++) {
        if (todo[i].userId === req.user.id) {
            return;
        }
    }
    throw new AccessDeniedException();
}