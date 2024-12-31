import { ApiResponse } from "types/ApiResponse";
import { showToast } from "utils/toast";

export function handleApiResponse<T>(response: ApiResponse<T>): T {
  const { statusCode, message, data } = response;
  showToast({ statusCode, message });

  return data;
}
