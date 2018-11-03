export class Redirect {
  path: string;
  destination: string;
  editable: boolean;
}

export class SuccessFull {
  success: boolean;
}

export class Status {
  address: string;
  port: number;
  proxy: boolean;
}