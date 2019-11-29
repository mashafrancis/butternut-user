import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DeepPartial, MongoRepository, Repository } from 'typeorm';
import { CrudService } from '../../base';
import { passwordHash, RestException } from '../_helpers';
import { AppLogger } from '../app.logger';
import { CredentialsDto } from '../auth/dto/credentials.dto';
import { UserEmailEntity, UserEntity } from './entity';
import { UserErrorEnum } from './user-error.enum';
import { UserSubscriptionService } from './user-subscription.service';
import { USER_EMAIL_TOKEN, USER_TOKEN } from './user.constants';

@Injectable()
export class UserService extends CrudService<UserEntity> {
  private logger = new AppLogger(UserService.name);

  constructor(
    public readonly subscription: UserSubscriptionService,
    @Inject(USER_TOKEN) protected readonly repository: MongoRepository<UserEntity>,
    @Inject(USER_EMAIL_TOKEN) protected readonly userEmailRepository: Repository<UserEmailEntity>
  ) {
    super();
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    this.logger.debug(`[findByEmail] Looking in users for ${email}`);
    const user = await this.findOne({ where: { email: { eq: email } } });
    if (!user) {
      this.logger.debug(`[findByEmail] Not found in users an user with email ${email}`);
    }
    this.logger.debug(`[findByEmail] Found in users an user with id ${user.id}`);
    return user;
  }

  public async login(credentials: CredentialsDto): Promise<UserEntity> {
    const user = await this.findByEmail(credentials.email);

    if (!user) {
      throw new HttpException({
        error: 'User',
        message: `User not found`,
      },                      HttpStatus.NOT_FOUND);
    }

    if (user.password !== await passwordHash(credentials.password)) {
      throw new NotFoundException(`User doesn't exists`);
    }

    if (!user.is_verified) {
      throw new RestException({
        error: 'User',
        message: `User is not verified`,
        condition: UserErrorEnum.NOT_VERIFIED,
      },                      HttpStatus.PRECONDITION_FAILED);
    }
    return user;
  }

  public async create(data: DeepPartial<UserEntity>): Promise<UserEntity> {
    const entity = this.repository.create(data);
    await this.validate(entity);
    await entity.hashPassword();
    if (!entity.createdAt) {
      entity.createdAt = DateTime.utc();
    }
    this.logger.verbose('entity');
    entity.updatedAt = DateTime.utc();
    const user = await entity.save();
    this.logger.debug(`${user.first_name}`);
    this.logger.debug(`${user.password}`);
    // await this.subscription.create({ user: user.id, email: true });
    return user;
  }

  public async updatePassword(data: DeepPartial<UserEntity>): Promise<UserEntity> {
    const entity = await this.repository.findOneOrFail(data.id);
    entity.password = data.password;
    await this.validate(entity);
    await entity.hashPassword();
    entity.updatedAt = DateTime.utc();
    return this.repository.save(entity);
  }

  public async socialRegister(data: DeepPartial<UserEntity>) {
    const entity = this.repository.create(data);
    await this.validate(entity, { skipMissingProperties: true });
    entity.createdAt = DateTime.utc();
    entity.updatedAt = DateTime.utc();
    return this.repository.save(entity);
  }
}
