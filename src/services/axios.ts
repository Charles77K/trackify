/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
import TokenStorage from "./tokenStorage";
import Toast from "../lib/Toast";

export const baseURL: string = import.meta.env.VITE_BASE_URL;

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  message: string;
  status: number | null;
  data: any;
}

interface CustomError extends Error {
  status?: number | null;
  data?: any;
}

interface QueryParams {
  [key: string]: any;
}

class AxiosHelper {
  private client: AxiosInstance;

  constructor(defaultHeaders = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = TokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        const { response } = error;

        // Handle token refresh for 401 errors
        const isAuthRequest =
          originalRequest?.url?.includes("/login") ||
          originalRequest?.url?.includes("/token");

        if (
          response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isAuthRequest
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = TokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token found");
            }

            const res = await this.client.post("/auth/token/refresh/", {
              refresh: refreshToken,
            });

            const newAccessToken = res.data.access;

            // Update tokens using the specific implementation
            TokenStorage.setTokens({
              accessToken: newAccessToken,
              refreshToken,
            });

            // Update default headers for future requests
            this.client.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Update the failed request's headers
            if (originalRequest.headers) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
            }

            // Retry the original request
            return this.client(originalRequest);
          } catch (err) {
            TokenStorage.clearTokens();
            Toast.error("Session Expired", "Please login again.");
            return Promise.reject(err);
          }
        }

        // Handle other 401 errors
        if (response?.status === 401) {
          Toast.error("Error", "Unauthorized access. Please login again.");
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles axios error and extracts helpful info
   * @param error - The error object from axios
   * @returns Standardized error object
   */
  private handleError(error: any): CustomError {
    const errorResponse: ErrorResponse = {
      message: "An unexpected error occurred",
      status: null,
      data: null,
    };

    if (error.response) {
      errorResponse.message =
        error.response.data?.message ||
        `Request failed with status code ${error.response.status}`;
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    } else if (error.request) {
      errorResponse.message = "No response received from server";
    } else {
      errorResponse.message = error.message;
    }

    const customError: CustomError = new Error(errorResponse.message);
    customError.status = errorResponse.status;
    customError.data = errorResponse.data;
    return customError;
  }

  async getAll<T = any>(
    endpoint: string,
    params: QueryParams = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getById<T = any>(
    endpoint: string,
    id: string | number,
    params: QueryParams = {}
  ): Promise<T> {
    try {
      const url = endpoint.includes(":id")
        ? endpoint.replace(":id", id.toString())
        : `${endpoint}/${id}`;
      const response: AxiosResponse<T> = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async create<T = any, D = any>(endpoint: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async update<T = any, D = any>(
    endpoint: string,
    id: string | number,
    data: D
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(
        `${endpoint}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async patch<T = any, D = any>(
    endpoint: string,
    id: string | number,
    data: D
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(
        `${endpoint}/${id}/`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async delete<T = any>(endpoint: string, id: string | number): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(
        `${endpoint}/${id}/`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async customGet<T = any>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export default AxiosHelper;
