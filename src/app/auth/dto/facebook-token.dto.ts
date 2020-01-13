import { ApiProperty } from '@nestjs/swagger';

export class FacebookTokenDto {
  @ApiProperty()
  access_token: string;
}
