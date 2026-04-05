import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { Roles } from "../authorization/decorators/roles.decorator";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { Public } from "@/modules/authorization/decorators/public.decorator";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    create(@Body() dto: CreateUserDto, dormitoryId?: number) {
        return this.userService.createUserByAdmin(dto, dormitoryId);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    list() {
        return this.userService.listUsers();
    }

    @Patch(":id/role")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    updateRole(@Param("id") id: string, @Body() body: { role: string }) {
        return this.userService.updateRole(id, body.role);
    }

    @Patch(":id/status")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
        return this.userService.updateStatus(id, body.status);
    }

    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles("ADMIN")
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }

    @Public()
    @Get(":id")
    findUserByID(@Param("id") id: string) {
        return this.userService.findUserById(id);
    }
}
