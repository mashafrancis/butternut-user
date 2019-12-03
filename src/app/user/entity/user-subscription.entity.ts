import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserSubscriptionEntity extends ExtendedEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  public id: string;

  @ApiModelProperty()
  @IsString()
  @Column()
  public user: string;

  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean')
  public email: boolean;

  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean', { default: false })
  public push: boolean;

  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean', { default: false })
  public sms: boolean;
}
