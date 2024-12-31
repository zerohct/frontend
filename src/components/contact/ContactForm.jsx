import {
  Clock,
  FileText,
  MailIcon,
  MessageCircleCode,
  Phone,
  UniversityIcon,
} from "lucide-react";
import React from "react";

const ContactForm = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-blue-600 font-medium text-2xl text-center">
        Liên hệ với chúng tôi
      </h1>
      <p className="text-gray-600 text-center text-sm mt-1 mb-8">
        Trang web giải đáp mọi thắc mắc của sinh viên Khoa Công nghệ Thông tin
        về các hoạt động, sự kiện.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Contact Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <FileText className="w-4 h-4" />
              <h3 className="text-sm font-medium">Thông tin cá nhân</h3>
            </div>

            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Họ tên"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-400"
                placeholder="Mã số sinh viên"
              />
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-400"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <MessageCircleCode className="w-4 h-4" />
              <h3 className="text-sm font-medium">Nội dung</h3>
            </div>

            <textarea
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Bạn cần liên hệ về vấn đề gì"
            ></textarea>
          </div>
        </div>

        {/* Right side - Contact Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-white">
          <h2 className="text-lg font-medium mb-6">Thông tin liên hệ</h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <UniversityIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Văn phòng khoa CNTT: E1 - 02.06
                </p>
                <p className="text-xs text-white/80 mt-1">
                  Trường Đại học Công nghệ TP.HCM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <MailIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:khoa.cntt@hutech.edu.vn"
                  className="text-xs text-white/80 block mt-1"
                >
                  khoa.cntt@hutech.edu.vn
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Số điện thoại</p>
                <a
                  href="tel:(028)71012388"
                  className="text-xs text-white/80 block mt-1"
                >
                  (028) 7101 2388
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2 rounded-md">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Giờ làm việc</p>
                <p className="text-xs text-white/80 mt-1">
                  07:30 am - 16:30 pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
