import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserSubscriptionEntity extends ExtendedEntity {

  @ApiProperty()
  @ObjectIdColumn()
  public id: string;

  @ApiProperty()
  @IsString()
  @Column()
  public user: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean')
  public email: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean', { default: false })
  public push: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column('boolean', { default: false })
  public sms: boolean;
}
