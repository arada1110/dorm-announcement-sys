import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { TargetTypes } from "@/data/abstactions/entities/IAnnouncement";

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsString()
    categoryName!: string;

    @IsOptional()
    @IsBoolean()
    isLineNotificationEnabled?: boolean;

    @IsEnum(TargetTypes)
    targetType!: TargetTypes;

    @ValidateIf((o) => o.targetType === TargetTypes.ROOM)
    @IsNumber()
    roomId?: number;

    @ValidateIf((o) => o.targetType === TargetTypes.USER)
    @IsString()
    targetUserId?: string;

    @IsString()
    @IsNotEmpty()
    creatorId!: string;
}

export class UpdateAnnouncementDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    categoryName?: string;

    @IsOptional()
    @IsBoolean()
    isLineNotificationEnabled?: boolean;

    @IsOptional()
    @IsEnum(TargetTypes)
    targetType?: TargetTypes;

    @IsOptional()
    @IsNumber()
    roomId?: number | null;

    @IsOptional()
    @IsString()
    userId?: string | null;
}
