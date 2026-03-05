import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { InviteService } from "./invite.service";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { Roles } from "../authorization/decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("invites")
export class InviteController {
    constructor(private readonly inviteService: InviteService) {}

    @Post()
    create(@Body() body: { roomNumber: string; expired_at?: Date }) {
        return this.inviteService.createInvite(body.roomNumber, body.expired_at);
    }

    @Get()
    list() {
        return this.inviteService.listInvites();
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.inviteService.deleteInvite(Number(id));
    }
}
