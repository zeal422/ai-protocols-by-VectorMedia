export class ProtocolError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'ProtocolError';
    }
}
export function handleError(error, context) {
    if (error instanceof ProtocolError) {
        return error;
    }
    if (error instanceof Error) {
        return new ProtocolError(`${context}: ${error.message}`, 'INTERNAL_ERROR', { originalError: error.message });
    }
    return new ProtocolError(`${context}: Unknown error`, 'UNKNOWN_ERROR', { error });
}
export function createErrorResponse(error) {
    return {
        content: [{
                type: "text",
                text: `Error [${error.code}]: ${error.message}`
            }],
        isError: true
    };
}
//# sourceMappingURL=error-handler.js.map