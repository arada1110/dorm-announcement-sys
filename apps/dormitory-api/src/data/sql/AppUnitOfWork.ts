import { Injectable } from "@nestjs/common";
import { UnitOfWork } from "@/database/ีUnitOfWork";

@Injectable()
export class AppUnitOfWork extends UnitOfWork {}
