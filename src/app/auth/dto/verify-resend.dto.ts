import { ApiProperty } from '@nestjs/swagger';

export class VerifyResendDto {
  @ApiProperty()
  email: string;
}
