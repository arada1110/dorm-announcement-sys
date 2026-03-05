import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
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
    list() {
        return this.roomService.listRoom();
    }

    @Get(":roomNumber")
    find(@Param("roomNumber") roomNumber: string) {
        return this.roomService.findRoom(roomNumber);
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
