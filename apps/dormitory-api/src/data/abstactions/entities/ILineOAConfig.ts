export interface ILineOAConfig {
    id: string;
    dormitory_id: number;
    line_oa_id: string;
    channel_id: string;
    channel_secret: string;
    channel_access_token: string;
    add_friend_url?: string;
    liff_id?: string;
    notification_enabled: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
