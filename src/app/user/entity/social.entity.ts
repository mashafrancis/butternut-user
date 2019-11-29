import { ApiModelProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { uid } from '../../../utils/fancyGenerator';
import { ExtendedEntity } from '../../_helpers';

@Entity()
export class SocialEntity extends ExtendedEntity {

  @ApiModelProperty()
  @PrimaryColumn('varchar', { length: 255 })
  public id: string;

  @ApiModelProperty()
  @Column()
  public userId: string;

  @BeforeInsert()
  addId() {
    this.id = uid.generate();
  }
}
