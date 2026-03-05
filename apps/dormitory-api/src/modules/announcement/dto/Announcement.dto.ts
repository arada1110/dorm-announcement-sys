import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { TargetTypes } from "src/data/abstactions/entities/IAnnouncement";

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    categoryName: string;

    @IsOptional()
    @IsBoolean()
    isLineNotificationEnabled?: boolean;

    @IsEnum(TargetTypes)
    targetType?: TargetTypes;

    @ValidateIf((o) => o.targetType === TargetTypes.ROOM)
    @IsNumber()
    roomId?: number;

    @ValidateIf((o) => o.targetType === TargetTypes.USER)
    @IsNumber()
    userId?: number;
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
    @IsNumber()
    userId?: number | null;
}
