import { TargetTypes } from "@/data/abstactions/entities/IAnnouncement";

export interface AnnouncementTargetDto {
    announcement_id: number;
    tartget_type: TargetTypes;
    room_id?: number | null;
    target_user_id?: string | null;
}
