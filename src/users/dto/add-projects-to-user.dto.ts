import { IsArray, IsNumber } from 'class-validator';

export class AddProjectsToUserDto {
  @IsArray()
  @IsNumber({}, { each: true })
  projects: number[];
}
