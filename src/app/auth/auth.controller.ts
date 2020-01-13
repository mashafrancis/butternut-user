import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { config } from '../../config';
import { RestException } from '../_helpers';
import { DeepPartial } from '../_helpers/database';
import { AppLogger } from '../app.logger';
import { USER_CMD_PASSWORD_NEW, USER_CMD_PASSWORD_RESET, USER_CMD_REGISTER, USER_CMD_REGISTER_VERIFY } from '../user';
import { UserEntity } from '../user/entity';
import { UserErrorEnum } from '../user/user-error.enum';
import { UserService } from '../user/user.service';
// import { AuthService } from './auth.userService';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtDto } from './dto/jwt.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { PasswordTokenDto } from './dto/password-token.dto';
import { UserEntityDto } from './dto/user-entity.dto';
import { VerifyResendDto } from './dto/verify-resend.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { createAuthToken, verifyToken } from './jwt';

@ApiTags('auth')
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
  @ApiBody({ required: true, type: UserEntityDto, description: 'UserEntityDto' })
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
  @ApiBody({ required: true, type: VerifyTokenDto, description: 'VerifyTokenDto' })
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

  @Post('register/verify/resend')
  @HttpCode(204)
  @ApiBody({ required: true, type: VerifyResendDto, description: 'VerifyResendDto' })
  @ApiResponse({ status: 204, description: 'NO CONTENT' })
  public async registerVerifyResend(@Body() body: VerifyResendDto): Promise<void> {
    try {
      this.logger.debug(`[registerVerifyResend] Email where resend verification ${body.email}`);
      const user = await this.userService.findByEmail(body.email);
      if (user.is_verified) {
        throw new Error(`User ${user.email} already verified`);
      }
      this.client.send({ cmd: USER_CMD_REGISTER }, user).subscribe(
        () => this.logger.debug(`[registerVerify] Sent command registry verify for email ${body.email}`),
        error => this.logger.error(error, '')
      );
    } catch (err) {
      this.logger.error(`[registerVerifyResend] ${err.message}`, err.stack);
    }
  }

  @Post('password/reset')
  @HttpCode(204)
  @ApiBody({ required: true, type: PasswordResetDto, description: 'PasswordResetDto' })
  @ApiResponse({ status: 204, description: 'NO CONTENT' })
  public passwordReset(@Body() data: DeepPartial<UserEntity>): void {
    this.logger.debug(`[passwordReset] User ${data.email} starts password reset`);
    this.client.send({ cmd: USER_CMD_PASSWORD_RESET }, { email: data.email }).subscribe(
      () => this.logger.debug(`[passwordReset] Sent command password reset for email ${data.email}`),
      error => this.logger.error(error, '')
    );
  }

  @Post('password/new')
  @HttpCode(204)
  @ApiBody({ required: true, type: PasswordTokenDto, description: 'PasswordTokenDto' })
  @ApiResponse({ status: 204, description: 'NO CONTENT' })
  public async passwordNew(@Body() body: PasswordTokenDto): Promise<void> {
    this.logger.debug(`[passwordNew] Token ${body.resetToken}`);
    const token = await verifyToken(body.resetToken, config.session.password_reset.secret);
    const user = await this.userService.updatePassword({ id: token.id, password: body.password });
    this.logger.debug(`[passwordNew] Send change password email for user ${user.email}`);
    this.client.send({ cmd: USER_CMD_PASSWORD_NEW }, user).subscribe(
      () => this.logger.debug(`[passwordNew] Sent command for new password for email ${user.email}`),
      error => this.logger.error(error, '')
    );
  }
}
