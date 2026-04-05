import { Controller, Post, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../authorization/guards/jwtAuth.guard";
import { LineAccountService } from "./lineAccount.service";

@UseGuards(JwtAuthGuard)
@Controller("line")
export class LineAccountController {
    constructor(private readonly lineAccountService: LineAccountService) {}

    @Post("linking-token")
    async getLinkingToken(@Request() req: any) {
        const token = await this.lineAccountService.generateLinkingToken(req.user.id);
        return {
            token,
            expiresInMinutes: 10,
        };
    }

    @Get("account")
    async getAccount(@Request() req: any) {
        const account = await this.lineAccountService.getLineAccount(req.user.id);
        return {
            linked: !!account,
            lineUserId: account?.line_user_id ?? null,
        };
    }
}
