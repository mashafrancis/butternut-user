import { createParamDecorator } from '@nestjs/common';

// @ts-ignore
export const Profile = createParamDecorator((data, req) => {
  return req.user;
});
