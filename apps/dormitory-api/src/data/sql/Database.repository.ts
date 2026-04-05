import { db } from "@/database/Connection";
import { UnitOfWork } from "@/database/ีUnitOfWork";

export abstract class DatabaseRepository {
    constructor(protected readonly uow: UnitOfWork) {}

    protected query() {
        return this.uow.getTransaction() ?? db;
    }
}
