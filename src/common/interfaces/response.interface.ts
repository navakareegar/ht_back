export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  timestamp: Date;
  path: string;
}
