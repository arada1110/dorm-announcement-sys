export interface IUserLineAccount {
    id?: number;
    user_id: string;
    line_user_id: string;
    created_at?: Date;
}

export interface IUserLineAccountWithDorm extends IUserLineAccount {
    dormitoryId: number;
}
