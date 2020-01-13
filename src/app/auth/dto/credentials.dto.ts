import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CredentialsDto {

  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
