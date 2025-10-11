export interface PropDataInput {
  [props: string]: any;
}

export interface ErrorResponseI {
  readonly message: string;
  readonly status: number;
  readonly data?: object;
  readonly location?: string;
}
