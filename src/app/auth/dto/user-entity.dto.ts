import { ApiModelProperty } from '@nestjs/swagger';

export class UserEntityDto implements Readonly<UserEntityDto> {
  @ApiModelProperty({ required: true })
  public first_name: string;

  @ApiModelProperty({ required: true })
  public last_name: string;

  @ApiModelProperty({ required: true })
  public email: string;

  @ApiModelProperty({
    minLength: 4,
    required: true,
  })
  public password: string;

  @ApiModelProperty()
  public phone_num: string;

  @ApiModelProperty({
    required: false,
  })
  public profile_img?: string;
}
