import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { Roles } from "../authorization/decorators/roles.decorator";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.createUserByAdmin(dto);
    }

    @Get()
    list() {
        return this.userService.listUsers();
    }

    @Patch(":id/role")
    updateRole(@Param("id") id: string, @Body() body: { role: string }) {
        return this.userService.updateRole(id, body.role);
    }

    @Patch(":id/status")
    updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
        return this.userService.updateStatus(id, body.status);
    }

    @Delete(":id")
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }
}
