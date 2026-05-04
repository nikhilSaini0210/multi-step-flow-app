import { BASE_URL, TIMEOUT_MS } from "@/constants/config";
import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "./types";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

export const apiRequest = async <T>(
  fn: () => Promise<any>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fn();
    const json = response.data;

    if (!json.success) {
      return {
        error: json?.error?.message ?? "Server error",
        statusCode: response.status,
      };
    }

    return { data: json.data, statusCode: response.status };
  } catch (err: any) {
    if (err.code === "ECONNABORTED") {
      return { error: "Request timed out. Check your connection." };
    }
    if (!err.response) {
      return { error: "No internet connection. Progress saved locally." };
    }

    const message =
      err.response?.data?.error?.message ??
      `Server error: ${err.response.status}`;
    return { error: message, statusCode: err.response.status };
  }
};
