import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength, ValidateIf } from 'class-validator';
import { DateTime } from 'luxon';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { uid } from '../../../utils/fancyGenerator';
import { ExtendedEntity, passwordHash } from '../../_helpers';

@Entity()
export class UserEntity extends ExtendedEntity {

  @ApiModelProperty()
  @PrimaryColumn('varchar', { length: 255 })
  public id: string;

  @ApiModelProperty()
  @IsString()
  @Column()
  public first_name: string;

  @ApiModelProperty()
  @IsString()
  @Column({ nullable: true })
  public last_name: string;

  @ApiModelProperty()
  @IsEmail()
  @IsOptional()
  @ValidateIf(o => !o.id)
  @Column('varchar', { unique: true, length: 255 })
  public email: string;

  @ApiModelProperty()
  @IsString()
  @Column({ nullable: true })
  public phone_num: string;

  @ApiModelProperty()
  @IsOptional()
  @IsUrl()
  @Column({ default: 'https://res.cloudinary.com/mashafrancis/image/upload/v1552641620/kari4me/nan.jpg' })
  public profile_img: string;

  @ApiModelProperty()
  @MinLength(4)
  @IsOptional()
  @Column('text')
  public password: string;

  @ApiModelProperty()
  @Column('boolean', { default: false })
  public is_verified: boolean;

  @ApiModelProperty()
  @IsOptional()
  @Column()
  public provider: string;

  @ApiModelProperty()
  @IsOptional()
  @Column()
  public socialId: string;

  @ApiModelProperty()
  @IsOptional()
  @Column()
  public phone_token: string;

  @Column()
  public activationCode: string;

  @Column({ type: 'timestamptz' })
  public onlineAt: DateTime;

  @BeforeInsert()
  addId() {
    this.id = uid.generate();
  }

  async hashPassword() {
    this.password = await passwordHash(this.password);
  }
}
