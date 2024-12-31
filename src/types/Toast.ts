// Enum định nghĩa loại toast
export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  ICON = "icon", // Loại toast có icon tùy chỉnh
}

// Interface cấu hình toast
export interface ToastConfig {
  type: ToastType;
  message: string;
  description?: string;
  icon?: string; // Icon tùy chỉnh
}
