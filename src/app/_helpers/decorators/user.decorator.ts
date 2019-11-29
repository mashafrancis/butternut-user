import { createParamDecorator } from '@nestjs/common';

// @ts-ignore
export const User = createParamDecorator((data, req) => {
  return req.user;
});
