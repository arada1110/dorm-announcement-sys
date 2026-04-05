import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { InviteService } from "../invite/invite.service";
import { UserService } from "../user/user.service";
import { RoomResidentService } from "../roomResident/roomResident.service";
import { CreateUserDto } from "../user/dto/createUser.dto";
import { AppUnitOfWork } from "@/data/sql/AppUnitOfWork";

@Injectable()
export class RegistrationService {
    constructor(
        private readonly inviteService: InviteService,
        private readonly userService: UserService,
        private readonly roomResidentService: RoomResidentService,
        private readonly uow: AppUnitOfWork,
    ) {}

    async register(dto: RegisterDto) {
        return this.uow.execute(async () => {
            try {
                const email = dto.email;
                const inviteCode = dto.inviteCode ?? dto.invite_code;

                if (!inviteCode) {
                    throw new BadRequestException("Invite code is required");
                }

                await this.ensureEmailNotExists(email);
                const invite = await this.inviteService.validateInvite(inviteCode);
                const user = await this.createResidentUser(dto);
                await this.assignUserToRoom(invite.room_id, user.id);
                await this.inviteService.markInviteAsUsed(invite.id, user.id);
                return user;
            } catch (error) {
                throw error;
            }
        });
    }

    private async ensureEmailNotExists(email: string) {
        const existingUser = await this.userService.findUserByEmail(email);

        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }
    }

    private async createResidentUser(dto: RegisterDto) {
        const { username, first_name, last_name, email, password } = dto;
        const userPayload: CreateUserDto = {
            username,
            email,
            first_name,
            last_name,
            password,
            role_name: "RESIDENT",
        };

        return this.userService.createResident(userPayload);
    }

    private async assignUserToRoom(roomId: number, userId: string) {
        return this.roomResidentService.addResident(roomId, userId);
    }
}
