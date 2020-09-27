import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppLogger } from './app';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlConfigService } from './app/_helpers/graphql';
import { AuthModule } from './app/auth/auth.module';
import { CommonModule } from './app/common/common.module';
import { DatabaseModule } from './app/database/database.module';
import { HealthCheckModule } from './app/healthcheck/healthcheck.module';
import { SecurityModule } from './app/security';
import { UserModule } from './app/user/user.module';

@Module({
	imports: [
		HealthCheckModule,
		SecurityModule,
		DatabaseModule,
		AuthModule,
		UserModule,
		CommonModule,
		GraphQLModule.forRootAsync({
			imports: [UserModule],
			useClass: GqlConfigService,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
	// GraphQLModule.forRoot({
	//     autoSchemaFile: 'schema.gql',
	//     playground: true,
	//   }),
})
export class AppModule {
	private logger = new AppLogger(AppModule.name);

	constructor() {
		this.logger.log('Initialize constructor');
	}
}
