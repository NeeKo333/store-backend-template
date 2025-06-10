export class CustomError extends Error {
  message: string;
  data: object | null;
  errorType: string;
  status: number;

  constructor(message: string, data: object | null = null, errorType: string, status: number = 500) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.message = message;
    this.data = data;
    this.errorType = errorType;
    this.status = status;
  }
}
