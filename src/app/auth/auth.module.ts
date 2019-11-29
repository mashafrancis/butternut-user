import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './stategies';

@Module({
  imports: [UserModule, DatabaseModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}
