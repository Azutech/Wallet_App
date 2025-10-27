export interface UnitCustomerResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      firstName: string;
      lastName: string;
      email: string;
      status: string;
    };
  };
}

export interface UnitDepositAccountResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      accountNumber: string;
      routingNumber: string;
      balance: number;
      currency: string;
      status: string;
    };
  };
}
