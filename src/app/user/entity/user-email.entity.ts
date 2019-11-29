import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserEmailEntity extends ExtendedEntity {

  @ApiModelProperty()
  @PrimaryColumn()
  public id: string; // user email

  @ApiModelProperty()
  @IsString()
  @Column()
  public user_id: string;
}
