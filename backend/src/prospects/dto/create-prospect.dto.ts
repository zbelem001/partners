import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt, Min, Max } from 'class-validator';

export class CreateProspectDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  sector: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  creationYear: number;

  @IsOptional()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsString()
  contactName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(50)
  motivation: string;

  @IsOptional()
  @IsString()
  collaborationAreas?: string;

  @IsNotEmpty()
  @IsString()
  agreementType: string;

  @IsOptional()
  @IsString()
  estimatedBudget?: string;

  @IsNotEmpty()
  @IsString()
  deadline: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
