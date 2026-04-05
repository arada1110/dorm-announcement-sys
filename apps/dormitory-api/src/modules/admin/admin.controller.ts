import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "../authorization/decorators/roles.decorator";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { RolesGuard } from "../authorization/guards/roles.guard";
import { AdminService } from "./admin.service";
import { AssignAdminDto } from "./dto/admin.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Post("assign-admin")
    assignAdmin(@Body() dto: AssignAdminDto) {
        return this.adminService.assignAdmin(dto);
    }
}
