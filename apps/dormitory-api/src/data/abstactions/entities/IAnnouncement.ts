export interface IAnnouncementCategories {
    id: number;
    category_name: string;
    description: string;
    is_active: boolean;
}

export interface IAnnouncements {
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
    is_line_sent: boolean;
    line_sent_at?: Date | null;
}

export interface IAnnouncementTarget {
    id?: number;
    announcement_id: number;
    target_type: TargetTypes;
    room_id?: number | null;
    user_id?: string | null;
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
    category_name: string;
    created_at: string;
}
