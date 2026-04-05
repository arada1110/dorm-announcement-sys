import { IRoom } from "../entities/IRoom";

export interface IRoomRepository {
    listRoom(): Promise<IRoom[]>;
    findRoom(roomNumber: string): Promise<IRoom>;
    createRoom(entities: Partial<IRoom>): Promise<IRoom>;
    deleteRoom(id: number): Promise<void>;
    findByBuilding(buildingName: string, floor?: number): Promise<IRoom[]>;
    findRoomById(roomId: number): Promise<IRoom>;
}
