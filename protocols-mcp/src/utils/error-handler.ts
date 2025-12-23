export class ProtocolError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ProtocolError';
  }
}

export function handleError(error: unknown, context: string): ProtocolError {
  if (error instanceof ProtocolError) {
    return error;
  }

  if (error instanceof Error) {
    return new ProtocolError(
      `${context}: ${error.message}`,
      'INTERNAL_ERROR',
      { originalError: error.message }
    );
  }

  return new ProtocolError(
    `${context}: Unknown error`,
    'UNKNOWN_ERROR',
    { error }
  );
}

export function createErrorResponse(error: ProtocolError) {
  return {
    content: [{
      type: "text",
      text: `Error [${error.code}]: ${error.message}`
    }],
    isError: true
  };
}
