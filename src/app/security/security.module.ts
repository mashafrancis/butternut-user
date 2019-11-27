import { Global, Module } from '@nestjs/common';
import { AuthorizationChecker } from './authorization-checker';
import { SecurityService } from './security.service';
import { VoterRegistry } from './voter';

const PROVIDERS = [
  VoterRegistry,
  SecurityService,
  AuthorizationChecker,
];

@Global()
@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SecurityModule {
}
