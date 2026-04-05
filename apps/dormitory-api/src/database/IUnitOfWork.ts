import { Knex } from "knex";

export interface IUnitOfWork {
    start(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    getTransaction(): Knex.Transaction | null;
}
