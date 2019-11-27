import { ApiModelProperty } from '@nestjs/swagger';

export class UserEntityDto {
  @ApiModelProperty()
  public first_name: string;

  @ApiModelProperty()
  public last_name: string;

  @ApiModelProperty()
  public email: string;

  @ApiModelProperty({
    minLength: 4,
  })
  public password: string;

  @ApiModelProperty()
  public phone_num: string;

  @ApiModelProperty({
    required: false,
  })
  public profile_img?: string;
}
