import { FastifyRequest } from "fastify";
import { getCreatorId, getGrants } from "../../modules/todo/repository.todo";
import { sqlCon } from "../config/kysely-config";
import { AccessDeniedException } from "../exceptions/AccessDeniedException";

export async function isOwnerMiddleware(req: FastifyRequest<{ Params: { id: string } }>) {
    const { id } = req.params;
    const todo = await getCreatorId(sqlCon, id);

    if (todo && todo.creatorId !== req.user.id) {
        throw new AccessDeniedException();
    }
}

export async function accessGrantedMiddleware(req: FastifyRequest<{ Params: { id: string } }>) {
    const { id } = req.params;
    const todo = await getGrants(sqlCon, id, req.user.id!);
    if (!todo) {
        throw new AccessDeniedException();
    }
}
