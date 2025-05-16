type ResponseObject = {
    message: string
}

export interface IErrorHandlerService {
    checkError(error: unknown): never,
    handleError(error: unknown): ResponseObject
}