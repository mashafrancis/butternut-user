import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiImplicitBody, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { RestException } from '../_helpers';
import { DeepPartial } from '../_helpers/database';
import { AppLogger } from '../app.logger';
import { USER_CMD_REGISTER, USER_CMD_REGISTER_VERIFY } from '../user';
import { UserEntity } from '../user/entity';
import { UserErrorEnum } from '../user/user-error.enum';
import { UserService } from '../user/user.service';
// import { AuthService } from './auth.userService';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtDto } from './dto/jwt.dto';
import { UserEntityDto } from './dto/user-entity.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { createAuthToken } from './jwt';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  @Client({ transport: Transport.TCP })
  private client: ClientProxy;
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
    this.logger.debug(`[register] User ${data.email} registered`);
    // tslint:disable-next-line:no-empty
    this.client.send({ cmd: USER_CMD_REGISTER }, user).subscribe(
      () => this.logger.debug(`[register] Send registration email for email ${data.email}`),
      error => this.logger.error(error, ``));
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

  @Post('register/verify')
  @HttpCode(200)
  @ApiImplicitBody({ required: true, type: VerifyTokenDto, name: 'VerifyTokenDto' })
  @ApiResponse({ status: 200, description: 'OK', type: JwtDto })
  public async registerVerify(@Body() body: VerifyTokenDto): Promise<JwtDto> {
    this.logger.debug(`[registerVerify] Token ${body.verifyToken}`);
    const user = await this.userService.findByEmail(body.email);
    if (user.activationCode !== body.verifyToken) {
      throw new RestException({
        error: 'Auth',
        message: `Wrong verification token`,
        condition: UserErrorEnum.NOT_VERIFIED,
      },                      HttpStatus.UNPROCESSABLE_ENTITY);
    }
    user.is_verified = true;
    await this.userService.update(user);
    this.client.send({ cmd: USER_CMD_REGISTER_VERIFY }, user).subscribe(
      () => this.logger.debug(`[registerVerify] Sent command register verify for user id ${user.id}`),
      error => this.logger.error(error, '')
    );
    return createAuthToken(user);
  }
}
