import React from "react";

interface ImageDisplayProps {
  base64Image: string;
  alt?: string;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  base64Image,
  alt = "Event Image",
  className = "w-full h-48 object-cover rounded-lg",
}) => {
  return (
    <img
      src={base64Image} // Dùng trực tiếp chuỗi base64 từ server
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("Image load error", e);
        // Đặt ảnh placeholder nếu ảnh lỗi
        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
      }}
    />
  );
};

export default ImageDisplay;
