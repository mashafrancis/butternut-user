import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CredentialsDto {

  @ApiModelProperty()
  @IsString()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  readonly password: string;
}
