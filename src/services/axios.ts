/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";

export const baseURL: string = import.meta.env.VITE_API_BASE_URL;

interface ErrorResponse {
  message: string;
  status: number | null;
  data: any;
}

interface CustomError extends Error {
  status?: number | null;
  data?: any;
}

interface DefaultHeaders {
  [key: string]: string;
}

interface QueryParams {
  [key: string]: any;
}

class AxiosHelper {
  private client: AxiosInstance;

  constructor(defaultHeaders: DefaultHeaders = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
      },
    });

    // Remove content type when needed
    this.client.interceptors.request.use((config) => {
      if (config.data instanceof FormData) {
        delete config.headers!["Content-Type"]; // Let browser set it
      }
      return config;
    });

    // Add interceptors for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers!.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const { response } = error;
        // Handle specific HTTP error codes
        if (response && response.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          console.error("Unauthorized access. Please login again.");
          // Potentially trigger a logout or redirect
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
        : `${endpoint}${id}`;
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
      const response: AxiosResponse<T> = await this.client.patch(
        `${endpoint}/${id}`,
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
        `${endpoint}/${id}`
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
