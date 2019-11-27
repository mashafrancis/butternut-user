import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { CrudService } from '../../base';
import { UserSubscriptionEntity } from './entity/user-subscription.entity';
import { USER_SUBSCRIPTION_TOKEN } from './user.constants';

@Injectable()
export class UserSubscriptionService extends CrudService<UserSubscriptionEntity> {

  constructor(@Inject(USER_SUBSCRIPTION_TOKEN) protected readonly repository: MongoRepository<UserSubscriptionEntity>) {
    super();
  }
}
