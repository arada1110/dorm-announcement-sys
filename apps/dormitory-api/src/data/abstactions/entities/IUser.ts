export interface IUser {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role_id: number;
    status: string;
    created_at: Date;
}

export interface IUserWithRole extends IUser {
    role_name: string;
}
