import { ApiProperty } from '@nestjs/swagger';

export class UserEntityDto implements Readonly<UserEntityDto> {
  @ApiProperty({ required: true })
  public first_name: string;

  @ApiProperty({ required: true })
  public last_name: string;

  @ApiProperty({ required: true })
  public email: string;

  @ApiProperty({
    minLength: 4,
    required: true,
  })
  public password: string;

  @ApiProperty()
  public phone_num: string;

  @ApiProperty({
    required: false,
  })
  public profile_img?: string;
}
