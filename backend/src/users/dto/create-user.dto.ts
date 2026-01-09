export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  employeeId?: string | null;
  role: string;
  department: string;
  password?: string;
  passwordHash?: string;
}
