import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Create an account
   */
  @Post()
  async signUp(@Body() authCredentials: UserSignUpDto) {
    return this.authService.signUp(authCredentials);
  }
}
