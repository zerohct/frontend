import { toast } from "react-toastify";
import { ToastType } from "../types/Toast";

// Hàm lấy cấu hình toast theo statusCode
export function getToastConfigByStatusCode(
  statusCode: number,
  message?: string,
) {
  const checkIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  );

  switch (true) {
    case statusCode >= 200 && statusCode < 300:
      return {
        type: ToastType.SUCCESS,
        message: message || "Thành công",
        description: "Thao tác diễn ra thành công",
        icon: checkIcon,
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "8px",
        },
      };

    case statusCode >= 400 && statusCode < 500:
      return {
        type: ToastType.ERROR,
        message: message || "Lỗi yêu cầu",
        description: "Có lỗi xảy ra với yêu cầu của bạn",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8v4m0 4v4m0-12h0m-4.28 10.72a7.99 7.99 0 1 0 11.56 0 7.99 7.99 0 1 0-11.56 0z"></path>
          </svg>
        ),
        style: {
          backgroundColor: "#F44336",
          color: "white",
          borderRadius: "8px",
        },
      };

    case statusCode >= 500:
      return {
        type: ToastType.ERROR,
        message: message || "Lỗi hệ thống",
        description: "Máy chủ đang gặp sự cố",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8v4m0 4v4m0-12h0m-4.28 10.72a7.99 7.99 0 1 0 11.56 0 7.99 7.99 0 1 0-11.56 0z"></path>
          </svg>
        ),
        style: {
          backgroundColor: "#F44336",
          color: "white",
          borderRadius: "8px",
        },
      };

    default:
      return {
        type: ToastType.INFO,
        message: message || "Thông báo",
        description: "Có thông báo mới",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8v4m0 4v4m0-12h0m-4.28 10.72a7.99 7.99 0 1 0 11.56 0 7.99 7.99 0 1 0-11.56 0z"></path>
          </svg>
        ),
        style: {
          backgroundColor: "#2196F3",
          color: "white",
          borderRadius: "8px",
        },
      };
  }
}

// Hàm hiển thị thông báo và xử lý dữ liệu trả về
export function showToast(response: { statusCode: number; message: string }) {
  const { statusCode, message } = response;
  const toastConfig = getToastConfigByStatusCode(statusCode, message);

  // Hiển thị thông báo
  toast(`${toastConfig.message}`, {
    icon: toastConfig.icon,
    style: toastConfig.style,
    autoClose: 5000,
    closeButton: true,
  });

  // // Xử lý dữ liệu trả về
  // if (statusCode >= 200 && statusCode < 300 && data) {
  //     console.log('Dữ liệu trả về:', data);
  // }
}
