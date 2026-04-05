import { Body, Controller, Headers, Post, Query } from "@nestjs/common";
import { Public } from "../authorization/decorators/public.decorator";
import { LineWebhookService } from "./lineWebhook.service";

@Controller("line")
export class LineWebhookController {
    constructor(private readonly lineWebhookService: LineWebhookService) {}

    @Public()
    @Post("webhook")
    async handleWebhook(
        @Body() body: any,
        @Headers("x-line-signature") signature: string,
        @Query("dormitoryId") dormitoryId: string,
    ) {
        return this.lineWebhookService.handleEvent(body, signature, parseInt(dormitoryId));
    }
}
