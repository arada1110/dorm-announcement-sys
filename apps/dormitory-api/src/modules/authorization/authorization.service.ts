import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { RoleRepository } from "src/data/sql/repositories/Role.repository";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    private userRepo = new UserRepository();
    private roleRepo = new RoleRepository();

    constructor(private readonly jwtService: JwtService) {}

    async register(dto: RegisterDto) {
        const { email, username, first_name, last_name, password } = dto;

        // 1️⃣ เช็ค email ซ้ำ
        const existingUser = await this.userRepo.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        // 2️⃣ หา role RESIDENT
        const role = await this.roleRepo.findByName("RESIDENT");
        if (!role) {
            throw new Error("RESIDENT role not found");
        }

        // 3️⃣ hash password
        const password_hash = await bcrypt.hash(password, 10);

        // 4️⃣ create user
        const createdUser = await this.userRepo.createUser({
            username,
            email,
            first_name,
            last_name,
            password_hash,
            role_id: role.id,
            status: "ACTIVE",
            created_at: new Date(),
        });

        // 5️⃣ ลบ password ก่อน return
        const { password_hash: _, ...safeUser } = createdUser;

        return safeUser;
    }

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
