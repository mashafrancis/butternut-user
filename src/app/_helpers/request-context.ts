import cls from 'cls-hooked';
import { Request, Response } from 'express';
import * as uuid from 'uuid';
import { UserEntity } from '../user/entity';

export class RequestContext {

  public static nsid = uuid.v4();
  public readonly id: number;
  public request: Request;
  public response: Response;

  constructor(request: Request, response: Response) {
    this.id = Math.random();
    this.request = request;
    this.response = response;
  }

  public static currentRequestContext(): RequestContext {
    const session = cls.getNamespace(RequestContext.nsid);
    if (session && session.active) {
      return session.get(RequestContext.name);
    }

    return null;
  }

  public static currentRequest(): Request {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      return requestContext.request;
    }

    return null;
  }

  // @ts-ignore
  public static currentUser(throwError?: boolean): UserEntity {
    const requestContext = RequestContext.currentRequestContext();

    if (requestContext) {
      // @ts-ignore
      const user: UserEntity = requestContext.request.user;
      if (user) {
        return user;
      }
    }

    return null;
  }
}
