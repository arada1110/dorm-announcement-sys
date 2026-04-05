import { db } from "./Connection";
import { Knex } from "knex";

export async function withTransaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return db.transaction(async (trx) => {
        try {
            const result = await callback(trx);
            return result;
        } catch (error) {
            throw error;
        }
    });
}
