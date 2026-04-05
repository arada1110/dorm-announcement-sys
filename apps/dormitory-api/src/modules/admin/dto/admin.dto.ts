import { IsNumber, IsString } from "class-validator";

export class AssignAdminDto {
    @IsString()
    userId: string;

    @IsNumber()
    dormitoryId: number;
}
