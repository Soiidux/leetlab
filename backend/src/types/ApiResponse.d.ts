global {
  interface ApiResponse<T> {
    status: number;
    success: boolean;
    data: T;
    message: string;
  }
}

export { };