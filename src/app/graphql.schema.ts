
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class DeleteUserInput {
    id: string;
}

export class UpdateUserInput {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_num?: string;
    profile_img?: string;
    phone_token?: string;
    password?: string;
}

export abstract class IMutation {
    abstract updateUser(updateUserInput?: UpdateUserInput): User | Promise<User>;

    abstract deleteUser(deleteUserInput?: DeleteUserInput): User | Promise<User>;
}

export abstract class IQuery {
    abstract me(): User | Promise<User>;
}

export abstract class ISubscription {
    abstract userCreated(): User | Promise<User>;

    abstract userDeleted(): User | Promise<User>;
}

export class User {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_num?: string;
    profile_img?: string;
    password?: string;
    provider?: string;
    phone_token?: string;
    socialId?: string;
    subscriptions?: UserSubscription;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserSubscription {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
}
