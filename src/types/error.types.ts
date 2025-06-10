type ResponseObject = {
    message: string,
    status: number
}

export interface IErrorHandlerService {
    checkError(error: unknown): never,
    handleError(error: unknown): ResponseObject
}