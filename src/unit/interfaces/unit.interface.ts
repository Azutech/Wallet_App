export interface SyncteraCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

export interface SyncteraAccount {
  id: string;
  account_number: string;
  routing_number: string;
  bank_name?: string;
}
