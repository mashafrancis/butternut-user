import { ApiProperty } from '@nestjs/swagger';

export class PasswordTokenDto {
  @ApiProperty()
  resetToken: string;

  @ApiProperty()
  password: string;
}
