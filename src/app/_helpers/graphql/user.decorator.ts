import { createParamDecorator } from '@nestjs/common';

// @ts-ignore
export const User = createParamDecorator((data, [root, args, ctx, info]) => {
  return ctx.req.user;
});
