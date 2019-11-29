import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiImplicitBody, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { DeepPartial } from '../_helpers/database';
import { AppLogger } from '../app.logger';
import { UserEntity } from '../user/entity';
import { UserService } from '../user/user.service';
// import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtDto } from './dto/jwt.dto';
import { UserEntityDto } from './dto/user-entity.dto';
import { createAuthToken } from './jwt';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new AppLogger(AuthController.name);

  constructor(
    // private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  @HttpCode(204)
  @ApiImplicitBody({ required: true, type: UserEntityDto, name: 'UserEntityDto' })
  @ApiResponse({ status: 204, description: 'NO_CONTENT' })
  public async register(@Body() data: DeepPartial<UserEntity>): Promise<UserEntity> {
    const user = await this.userService.create(data);
    this.logger.debug(`[register] User ${data.email} register`);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', type: JwtDto })
  public async login(@Body() credentials: CredentialsDto): Promise<JwtDto> {
    const user = this.userService.login(credentials);
    this.logger.debug(`[login] User ${credentials.email} login`);
    return createAuthToken(await user);
  }
}
