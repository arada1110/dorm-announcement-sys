export interface IRoom {
    id: number;
    room_number: string;
    dormitory_id: number;
    building_id: number;
    floor: number;
    building_name?: string;
    dormitory_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface IRoomResident {
    id: number;
    room_id: number;
    user_id: string;
    start_date: Date;
    end_date?: Date | null;
}
