import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    private userRepo = new UserRepository();

    constructor(private readonly jwtService: JwtService) {}

    async login(dto: LoginDto) {
        const { email, password } = dto;

        const user = await this.userRepo.findUserByEmailWithRole(email);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (user.status !== "ACTIVE") {
            throw new UnauthorizedException("User inactive");
        }

        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role_name,
        };

        const access_token = await this.jwtService.signAsync(payload);

        const { password_hash, ...safeUser } = user;

        return {
            access_token,
            user: safeUser,
        };
    }
}
