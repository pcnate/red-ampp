export class Redirect {
  path: string;
  destination: string;
  editable: boolean;
}

export class SuccessFull {
  success: boolean;
}

export class Request {
  path: string;
  count: number;
}

export class Status {
  address: string;
  port: number;
  proxy: boolean;
  requests: Request[];
}

export class Log {
  host: string;
  url: string;
  date: Date;
}