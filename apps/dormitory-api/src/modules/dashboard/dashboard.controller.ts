import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/modules/authorization/guards/jwtAuth.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get("stats")
    getStats(@Req() req) {
        return this.dashboardService.getStats(req.user);
    }
}
