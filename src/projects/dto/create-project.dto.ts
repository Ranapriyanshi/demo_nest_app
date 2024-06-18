import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsArray()
    @IsNumber({}, { each: true })
    users: number[];
}
