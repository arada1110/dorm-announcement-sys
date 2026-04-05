import { db } from "./Connection";
import { Knex } from "knex";
import { IUnitOfWork } from "./IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {
    protected trx: Knex.Transaction | null = null;

    async start(): Promise<void> {
        this.trx = await db.transaction();
    }

    async commit(): Promise<void> {
        if (this.trx) {
            await this.trx.commit();
            this.trx = null;
        }
    }

    async rollback(): Promise<void> {
        if (this.trx) {
            await this.trx.rollback();
            this.trx = null;
        }
    }

    getTransaction(): Knex.Transaction | null {
        return this.trx;
    }

    async execute<T>(callback: () => Promise<T>): Promise<T> {
        await this.start();

        try {
            const result = await callback();
            await this.commit();
            return result;
        } catch (error) {
            await this.rollback();
            throw error;
        }
    }
}
