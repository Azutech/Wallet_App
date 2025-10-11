export class UserDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  BVN: string;
  dateOfBirth: Date;
  userId?: string; // optional, for updates
  isActive?: boolean; // optional, for update
}
