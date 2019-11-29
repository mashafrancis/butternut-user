// import { UpdateUserInput } from '../../graphql.schema';
export class UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_num?: string;
  profile_img?: string;
  phone_token?: string;
  password?: string;
}

export class UpdateUserDto extends UpdateUserInput {
}
