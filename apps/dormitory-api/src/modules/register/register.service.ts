import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { InviteService } from "../invite/invite.service";
import { UserService } from "../user/user.service";
import { UserRepository } from "src/data/sql/repositories/User.repository";
import { RoleRepository } from "src/data/sql/repositories/Role.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class RegisterationService {
    private userRepo = new UserRepository();
    private roleRepo = new RoleRepository();

    constructor(
        private readonly inviteService: InviteService,
        private readonly userService: UserService,
    ) {}

    async register(dto: RegisterDto) {
        const { email, username, first_name, last_name, password, inviteCode } = dto;

        const existingUser = await this.userRepo.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const invite = await this.inviteService.validateInvite(inviteCode);

        const role = await this.roleRepo.findByName("RESIDENT");
        if (!role) {
            throw new Error("RESIDENT role not found");
        }

        const password_hash = await bcrypt.hash(password, 10);

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

        await this.inviteService.markInviteAsUsed(invite.invite_id);

        const { password_hash: _, ...safeUser } = createdUser;

        return safeUser;
    }
}

/*
@Injectable()
export class RegistrationService {
    constructor(
        private readonly inviteService: InviteService,
        private readonly userService: UserService,
    ) {}

    async register(dto: RegisterDto) {
        const invite = await this.inviteService.validateInvite(dto.inviteCode);

        const user = await this.userService.createResident(dto);

        await this.inviteService.markInviteAsUsed(invite.invite_id);

        return user;
    }
}
*/
