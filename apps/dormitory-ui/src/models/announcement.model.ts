export interface IAnnouncement {
    id: number;
    public_id: string;
    title: string;
    content: string;
    is_line_notification_enabled: boolean;
    dormitory_id: number;
    category_id: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}

export interface IAnnouncementBody {
    title: string;
    content: string;
    categoryName: string;
    targetType?: TargetTypes;
    roomId?: number;
    userId?: string;
}

export enum TargetTypes {
    ALL = "ALL",
    ROOM = "ROOM",
    USER = "USER",
}

export interface PublicAnnouncement {
    public_id: string;
    title: string;
    content: string;
    category_id: number;
    created_at: string;
}
