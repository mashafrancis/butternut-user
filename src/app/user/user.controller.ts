import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiImplicitBody, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { User } from '../_helpers/decorators';
import { SubscriptionDto } from './dto/subscription.dto';
import { UserEntity } from './entity';
import { UserCommand } from './user.command';
import { UserService } from './user.service';

@Controller('user')
@ApiUseTags('user')
export class UserController {
  constructor(
    protected service: UserService,
    private userCmd: UserCommand
  ) {}

  @Post('subscription')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiImplicitBody({ required: true, type: SubscriptionDto, name: 'SubscriptionDto' })
  @ApiResponse({ status: 201, description: 'ACCEPTED' })
  public async subscription(@Body() data: SubscriptionDto, @User() user: UserEntity): Promise<void> {
    try {
      const subscription = await this.service.subscription.findOne({ where: { user: { eq: user.id.toString() } } });
      await this.service.subscription.patch(subscription.id, data);
    } catch (err) {
      await this.service.subscription.create({ user: user.id.toString(), ...data });
    }
  }

  @Post('import')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  public async importUsers(): Promise<any> {
    return this.userCmd.create(20);
  }
}
