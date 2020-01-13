import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
