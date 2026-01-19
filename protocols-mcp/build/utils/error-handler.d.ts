export declare class ProtocolError extends Error {
    code: string;
    details?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, details?: Record<string, unknown> | undefined);
}
export declare function handleError(error: unknown, context: string): ProtocolError;
export declare function createErrorResponse(error: ProtocolError): {
    content: Array<{
        type: string;
        text: string;
    }>;
    isError: boolean;
};
//# sourceMappingURL=error-handler.d.ts.map