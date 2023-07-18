import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
