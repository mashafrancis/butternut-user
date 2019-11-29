import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserEmailEntity extends ExtendedEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  public id: string; // user email

  @ApiModelProperty()
  @IsString()
  @Column()
  public user_id: string;
}
