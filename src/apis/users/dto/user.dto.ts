export class UserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  BVN: string;
  dateOfBirth: Date;
  userId?: string; // optional, for updates
  isActive?: boolean; // optional, for update
}

export class LoginDto {
  email: string;
  password: string;
}
export class CodeDto {
  code: number;
}

export class ResetPasswordDto {
  readonly newPassword: string;
  readonly confirmPassword: string;
  token: string;
}
export class NINDto {
  readonly NIN: string;
  userId: string;
}
