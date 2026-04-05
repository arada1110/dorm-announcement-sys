import { IsString, IsOptional, IsBoolean, IsNumber } from "class-validator";

export class CreateLineConfigDto {
    @IsNumber()
    dormitoryId!: number;

    @IsString()
    lineOaId!: string;

    @IsString()
    channelId!: string;

    @IsString()
    channelSecret!: string;

    @IsString()
    channelAccessToken!: string;

    @IsOptional()
    @IsString()
    addFriendUrl?: string | "";

    @IsOptional()
    @IsString()
    liffId?: string | "";

    @IsOptional()
    @IsBoolean()
    notificationEnabled?: boolean | null;
}
