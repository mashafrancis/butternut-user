import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { config } from '../../config';

import { User } from '../_helpers/decorators';
import { mail, renderTemplate } from '../_helpers/mail';
import { AppLogger } from '../app.logger';
import { createToken } from '../auth/jwt';
import { SubscriptionDto } from './dto/subscription.dto';
import { UserEntity } from './entity';
import { UserCommand } from './user.command';
import {
  USER_CMD_PASSWORD_NEW,
  USER_CMD_PASSWORD_RESET,
  USER_CMD_REGISTER,
  USER_CMD_REGISTER_VERIFY,
} from './user.constants';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  private logger = new AppLogger(UserController.name);

  constructor(
    protected userService: UserService,
    private userCmd: UserCommand
  ) {}

  @Post('subscription')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiBody({ required: true, type: SubscriptionDto, description: 'SubscriptionDto' })
  @ApiResponse({ status: 201, description: 'ACCEPTED' })
  public async subscription(@Body() data: SubscriptionDto, @User() user: UserEntity): Promise<void> {
    try {
      const subscription = await this.userService.subscription.findOne({ where: { user: { eq: user.id.toString() } } });
      await this.userService.subscription.patch(subscription.id, data);
    } catch (err) {
      await this.userService.subscription.create({ user: user.id.toString(), ...data });
    }
  }

  @Post('import')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  public async importUsers(): Promise<any> {
    return this.userCmd.create(20);
  }

  @MessagePattern({ cmd: USER_CMD_REGISTER })
  public async onUserRegister(user: UserEntity): Promise<void> {
    try {
      const userRecord = await this.userService.findByEmail(user.email);
      this.logger.debug(`[onUserRegister] Send verification email for user ${user.email}`);
      const token = createToken(
        userRecord.id.toString(),
        config.session.verify_account.timeout,
        config.session.verify_account.secret
      );
      // tslint:disable-next-line:no-parameter-reassignment
      user = await this.userService.patch(user.id.toString(), { activationCode: token });
      this.logger.debug(token);
      await mail({
        subject: `Verify your account`,
        to: userRecord.email,
        html: renderTemplate(`/mail/verify_registration.twig`, { user, config, token }),
      });
      this.logger.debug('[onUserRegister] Account verification email sent');
    } catch (err) {
      this.logger.error(`[onUserRegister] Mail not sent, because ${JSON.stringify(err.message)}`, err.stack);
    }
  }

  @MessagePattern({ cmd: USER_CMD_REGISTER_VERIFY })
  public async onUserRegisterVerify(user: UserEntity): Promise<void> {
    try {
      this.logger.debug(`[onUserRegisterVerify] Send welcome email for user ${user.email}`);
      await mail({
        subject: `Welcome ${user.first_name} to ${config.name.toUpperCase()}`,
        to: user.email,
        html: renderTemplate(`/mail/welcome.twig`, { user, config }),
      });
      this.logger.debug('[onUserRegisterVerify] Welcome email sent');
    } catch (err) {
      this.logger.error(`[onUserRegisterVerify] Mail not sent, because ${err.message}`, err.stack);
    }
  }

  @MessagePattern({ cmd: USER_CMD_PASSWORD_RESET })
  public async onUserPasswordReset({ email }: { email: string }): Promise<void> {
    try {
      const user = await this.userService.findByEmail(email);
      this.logger.debug(`[onUserRegister] Send password reset instruction email for user ${user.email}`);
      const token = createToken(
        user.id.toString(), config.session.password_reset.timeout, config.session.password_reset.secret
      );
      await mail({
        subject: `Reset your password`,
        to: user.email,
        html: renderTemplate(`/mail/password_reset.twig`, { user, config, token }),
      });
      this.logger.debug('[onUserRegister] Password reset email sent');
    } catch (err) {
      this.logger.error(`[onUserRegister] Mail not sent, because ${JSON.stringify(err.message)}`, err.stack);
    }
  }

  @MessagePattern({ cmd: USER_CMD_PASSWORD_NEW })
  public async onUserPasswordNew(user: UserEntity): Promise<void> {
    try {
      this.logger.debug(`[onUserRegister] Send password new email for user ${user.email}`);
      await mail({
        subject: `You have a new password!`,
        to: user.email,
        html: renderTemplate(`/mail/password_new.twig`, { user, config }),
      });
      this.logger.debug('[onUserRegister] Password new email sent');
    } catch (err) {
      this.logger.error(`[onUserRegister] Mail not sent, because ${err.message}`, err.stack);
    }
  }
}
