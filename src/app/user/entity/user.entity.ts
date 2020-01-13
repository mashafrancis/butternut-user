import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, MinLength, Validate, ValidateIf } from 'class-validator';
import { DateTime } from 'luxon';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ExtendedEntity, passwordHash } from '../../_helpers';
import { IsUserAlreadyExist } from '../user.validator';

@Entity()
export class UserEntity extends ExtendedEntity {

  @ApiProperty()
  @ObjectIdColumn()
  public id: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  public first_name: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  public last_name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @ValidateIf(o => !o.id)
  @Validate(IsUserAlreadyExist, {
    message: 'User already exists',
  })
  @Column()
  public email: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  public phone_num: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  @Column({ default: 'https://res.cloudinary.com/mashafrancis/image/upload/v1552641620/kari4me/nan.jpg' })
  public profile_img: string;

  @ApiProperty()
  @MinLength(4)
  @IsOptional()
  @Column()
  public password: string;

  @ApiProperty()
  @Column()
  public is_verified: boolean;

  @ApiProperty()
  @IsOptional()
  @Column()
  public provider: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  public socialId: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  public phone_token: string;

  @IsOptional()
  @Column()
  public activationCode: string;

  @IsOptional()
  @Column({ nullable: true, type: 'timestamptz' })
  public onlineAt: DateTime;

  async hashPassword() {
    this.password = await passwordHash(this.password);
  }
}
