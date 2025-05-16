export class CustomError extends Error {
    message: string
    data: object | null;
    errorType: string;

    constructor(message: string, data:object | null = null, errorType: string) {
        super(message);
        this.message = message;
        this.data = data;
        this.errorType = errorType;
    }
}