import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { RegisterationService } from "./register.service";

@Controller("register")
export class RegisterController {
    constructor(private readonly registerService: RegisterationService) {}

    @Post()
    async register(@Body() dto: RegisterDto) {
        return this.registerService.register(dto);
    }
}
