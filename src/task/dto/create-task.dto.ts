import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  priority: string;

  @IsString()
  dueDate: string;
}
