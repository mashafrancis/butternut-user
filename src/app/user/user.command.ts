import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as faker from 'faker';
import { DateTime } from 'luxon';
import { Command, Positional } from 'nestjs-command';
import { AppLogger } from '../app.logger';
import { UserEntity } from './entity';
import { UserService } from './user.service';

@Injectable()
export class UserCommand {

  private logger = new AppLogger(UserCommand.name);

  constructor(
    private readonly userService: UserService
  ) {
    // @ts-ignore
    faker.locale = 'en_US';
  }

  // example usage: npm run cli -- create:user 100
  @Command({ command: 'create:user [amount]', describe: 'create a user' })
  public async create(@Positional({ name: 'amount' }) amount) {
    // tslint:disable-next-line:no-parameter-reassignment
    amount = parseInt(amount || 10, 10);
    this.logger.debug(`[create] execute for amount ${amount}!`);

    this.logger.debug(`[create] delete from db everything with provider "faker"`);
    await this.userService.deleteAll({ provider: { eq: 'faker' } });

    const persons: UserEntity[] = [];
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 0; i < amount; i++) {
      const first_name = faker.name.firstName();
      const last_name = faker.name.lastName();
      const person: UserEntity = plainToClass(UserEntity, {
        first_name,
        last_name,
        is_verified: true,
        provider: 'faker',
        socialId: faker.random.uuid(),
        email: faker.internet.email(first_name, last_name).toLowerCase(),
        password: faker.internet.password(),
        phone_num: faker.phone.phoneNumber(),
        profile_img: faker.internet.avatar(),
        createdAt: DateTime.utc().toString(),
        updatedAt: DateTime.utc().toString(),
      });
      persons.push(person);
      // this.logger.debug(`[create] create random person ppl with provider "faker" as ${JSON.stringify(person)}`);
      // await this.userService.create(person);
    }

    this.logger.debug(`[create] create ${amount} random ppl with provider "faker"`);
    await this.userService.saveAll(persons);
  }
}
