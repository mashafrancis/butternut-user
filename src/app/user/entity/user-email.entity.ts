import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class UserEmailEntity extends ExtendedEntity {

  @ApiProperty()
  @ObjectIdColumn()
  public id: string; // user email

  @ApiProperty()
  @IsString()
  @Column()
  public user_id: string;
}
