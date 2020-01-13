import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty()
  verifyToken: string;

  @ApiProperty()
  email: string;
}
