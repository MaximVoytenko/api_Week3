import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { editSchema } from "./schemas/edit.schema";

type InsertableUserRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableUserRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}

export async function edit(db: Kysely<DB> | Transaction<DB>, todo: Partial<editSchema>) {
    return db
        .updateTable("objectives")
        .set({
            title: todo.title,
            description: todo.description,
            notifyAt: todo.notifyAt ? new Date(todo.notifyAt) : null,
            updatedAt: new Date(),
            isCompleted: todo.isCompleted
        })
        .where("id", "=", todo.id as string)
        .returningAll()
        .executeTakeFirst();
}

export async function getList(
    con: Kysely<DB>,
    {
        search,
        sortBy = "createdAt",
        sortOrder = "asc",
        limit = 10,
        offset = 0,
        isCompleted
    }: {
        search?: string;
        sortBy?: "title" | "createdAt" | "notifyAt";
        sortOrder?: "asc" | "desc";
        limit?: number;
        offset?: number;
        isCompleted?: boolean;
    }
) {
    let query = con.selectFrom("objectives").selectAll();

    if (search) {
        query = query.where("title", "like", `%${search}%`);
    }

    if (isCompleted !== undefined) {
        query = query.where("isCompleted", "=", isCompleted);
    }
    query = query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);

    return await query.execute();
}

export async function getById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}
