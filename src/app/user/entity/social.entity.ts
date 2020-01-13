import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class SocialEntity extends ExtendedEntity {

  @ApiProperty()
  @ObjectIdColumn()
  public id: string;

  @ApiProperty()
  @Column()
  public userId: string;

  // @BeforeInsert()
  // addId() {
  //   this.id = uid.generate();
  // }
}
