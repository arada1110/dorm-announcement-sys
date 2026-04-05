import { IRoomResident } from "../entities/IRoom";

export interface IRoomResidentRepository {
    list(): Promise<IRoomResident[]>;
    createRoomResident(entities: Partial<IRoomResident>): Promise<IRoomResident>;
    findByUser(userId: string): Promise<IRoomResident>;
}
