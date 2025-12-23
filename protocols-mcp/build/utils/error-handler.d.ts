export declare class ProtocolError extends Error {
    code: string;
    details?: any | undefined;
    constructor(message: string, code: string, details?: any | undefined);
}
export declare function handleError(error: unknown, context: string): ProtocolError;
export declare function createErrorResponse(error: ProtocolError): {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
};
//# sourceMappingURL=error-handler.d.ts.map