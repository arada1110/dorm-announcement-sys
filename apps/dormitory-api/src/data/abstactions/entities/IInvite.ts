export interface IInvite {
    id: number;
    public_id: string;
    code: string;
    dormitory_id: number;
    room_id: number;
    is_used: boolean;
    expired_at: Date;
    created_at: Date;
}
