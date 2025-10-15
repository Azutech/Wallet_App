export class SetTransactionPinDto {
  userId: string;
  readonly newPin: string;
  readonly confirmPin: string;
}

export class WalletTransferDto {
  readonly senderId: string;
  readonly pin: string;
  readonly amount: number;
  readonly recipientEmail: string;
}
