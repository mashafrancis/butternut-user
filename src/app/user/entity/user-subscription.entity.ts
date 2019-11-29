import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { uid } from '../../../utils/fancyGenerator';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserSubscriptionEntity extends ExtendedEntity {

  @ApiModelProperty()
  @PrimaryColumn('varchar', { length: 255 })
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

  @BeforeInsert()
  addId() {
    this.id = uid.generate();
  }
}
