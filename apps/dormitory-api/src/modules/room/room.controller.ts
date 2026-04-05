import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Roles } from "../authorization/decorators/roles.decorator";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { RoomService } from "./room.service";
import * as roomDto from "./dto/room.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("rooms")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    list(@Query("name") name: string, @Query("floor") floor?: string) {
        const parsedFloor = floor ? Number(floor) : undefined;

        if (name) {
            return this.roomService.findRoomByBuilding(name, parsedFloor);
        }
        return this.roomService.listRoom(parsedFloor);
    }

    @Get(":id")
    find(@Param("id") roomId: number) {
        return this.roomService.findRoomById(roomId);
    }

    @Post()
    createRoom(@Body() dto: roomDto.CreateRoom) {
        return this.roomService.createRoom(dto);
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.roomService.deleteRoom(id);
    }
}
