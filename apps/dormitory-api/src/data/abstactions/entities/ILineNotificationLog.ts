export interface ILineNotificationLog {
    id?: number;
    announcement_id: number;
    user_id: string;
    status: string;
    error_message?: string | null;
}
