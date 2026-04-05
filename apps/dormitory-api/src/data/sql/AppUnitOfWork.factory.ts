import { Injectable } from "@nestjs/common";
import { AppUnitOfWork } from "./AppUnitOfWork";

@Injectable()
export class AppUnitOfWorkFactory {
    constructor(private readonly uow: AppUnitOfWork) {}

    create(): AppUnitOfWork {
        return this.uow;
    }
}
