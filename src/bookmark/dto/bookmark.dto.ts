import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  link: string
}