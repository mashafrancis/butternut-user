import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class SocialEntity extends ExtendedEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  public id: string;

  @ApiModelProperty()
  @Column()
  public userId: string;

  // @BeforeInsert()
  // addId() {
  //   this.id = uid.generate();
  // }
}
