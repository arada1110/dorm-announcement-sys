import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "@/data/sql/repositories/User.repository";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepo: UserRepository,
    ) {}

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
            dormitoryId: user.dormitory_id ?? null,
            roomId: user.room_id ?? null,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            status: user.status,
        };

        const access_token = await this.jwtService.signAsync(payload);

        const { password_hash, ...safeUser } = user;

        return {
            access_token,
            user: safeUser,
        };
    }

    async getMe(userId: string) {
        const user = await this.userRepo.findUserProfileById(userId);

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const { password_hash, ...safeUser } = user;

        return safeUser;
    }
}
