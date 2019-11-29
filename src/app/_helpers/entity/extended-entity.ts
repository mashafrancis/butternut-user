import { ApiModelProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { BaseEntity, Column } from 'typeorm';

export class ExtendedEntity extends BaseEntity {
  public id?: string;

  @Column('boolean', { default: false })
  public isDeleted: boolean;

  @ApiModelProperty()
  @Column({ type: 'timestamptz' })
  public createdAt: DateTime;

  @ApiModelProperty()
  @Column({ type: 'timestamptz' })
  public updatedAt: DateTime;
}
