import axios, { AxiosError } from 'axios';

interface DefaultApiErrorData {
    message?: string;
    details?: unknown;
    // Add any other common fields your API returns in error responses
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly data?: DefaultApiErrorData | unknown; // More specific error data type

    constructor(message: string, status: number, data?: DefaultApiErrorData | unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// Optional: A helper to create ApiError instances, especially from Axios errors
export function createApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<DefaultApiErrorData | unknown>;
        const status = axiosError.response?.status || 500;
        let message = axiosError.message; // Default to Axios message

        if (axiosError.response?.data) {
            const responseData = axiosError.response.data;
            if (typeof responseData === 'object' && responseData !== null && 'message' in responseData && typeof (responseData as { message: unknown }).message === 'string') {
                message = (responseData as { message: string }).message;
            }
        }
        return new ApiError(message, status, axiosError.response?.data);
    }

    if (error instanceof ApiError) {
        return error; // Return as is if already an ApiError
    }

    if (error instanceof Error) {
        return new ApiError(error.message, 500); // Generic status for other errors
    }

    return new ApiError(String(error), 500); // Fallback for unknown error types
}