export class SetTransactionPinDto {
  userId: string;
  readonly newPin: string;
  readonly confirmPin: string;
}
