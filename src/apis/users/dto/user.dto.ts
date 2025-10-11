export class UserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  BVN: string;
  dateOfBirth: Date;
  userId?: string; // optional, for updates
  balance?: string; // optional, for wallet creation
}
