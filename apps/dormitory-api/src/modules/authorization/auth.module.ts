import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./authorization.service";
import { AuthController } from "./authorization.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./stategies/jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { InviteCodeModule } from "../invite/invite.module";

@Module({
    imports: [
        PassportModule,
        InviteCodeModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>("JWT_SECRET"),
                signOptions: { expiresIn: "1d" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule {}
