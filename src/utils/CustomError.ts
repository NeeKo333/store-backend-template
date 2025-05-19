export class CustomError extends Error {
  message: string;
  data: object | null;
  errorType: string;

  constructor(message: string, data: object | null = null, errorType: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.message = message;
    this.data = data;
    this.errorType = errorType;
  }
}
