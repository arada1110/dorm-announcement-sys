import { ILineNotificationLog } from "../entities/ILineNotificationLog";

export interface ILineNotificationLogRepository {
    createLog(data: Partial<ILineNotificationLog>): Promise<ILineNotificationLog>;
    findLatest(limit: number): Promise<ILineNotificationLog[]>;
}
