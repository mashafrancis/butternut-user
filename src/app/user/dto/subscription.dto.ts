import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class SubscriptionDto {

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public email?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public push?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public sms?: boolean;
}
