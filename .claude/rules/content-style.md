# Ngôn ngữ, persona & phong cách giao diện

## Ngôn ngữ

Toàn bộ nội dung hiển thị trong app (nhãn nút, tiêu đề, toast, placeholder...) viết bằng **tiếng Việt**, giọng văn thân thiện-chuyên nghiệp phù hợp app dành cho sinh viên. Trao đổi với người dùng về dự án này cũng bằng tiếng Việt trừ khi họ chủ động dùng ngôn ngữ khác.

## Persona cố định trong dữ liệu mẫu

- **Sinh viên**: Quốc Anh, 19 tuổi, sinh viên năm 1 ngành Kinh doanh quốc tế, ĐH Kinh Tế TP.HCM (UEH), tài khoản mẫu trong `MOCK_ACCOUNTS.student`. Không đổi lại thành "Minh Anh" (tên persona cũ đã được thay hoàn toàn theo file persona thật của nhóm).
- **Chủ trọ**: Cô Nga, tài khoản mẫu duy nhất có thể đăng nhập trong `MOCK_ACCOUNTS.landlord`, quản lý `LANDLORD_ROOMS_DATA` (khác với `ROOMS_DATABASE` — xem `data-and-persistence.md`).
- Các chủ trọ khác xuất hiện trong `ROOMS_DATABASE` (Chú Bảy, Chị Mai, Bác Hùng, Chị Lan...) chỉ là tên hiển thị trang trí cho đa dạng, không có tài khoản đăng nhập riêng — đừng tạo thêm tài khoản đăng nhập mới cho họ trừ khi được yêu cầu rõ.

## Phong cách giao diện

- Tailwind CSS qua CDN + Font Awesome cho icon trong phần DOM (header, modal).
- Bảng màu chính: teal/emerald cho thương hiệu UNINEST (`#0D9488` và các sắc độ liên quan), slate cho nền tối/chữ phụ, amber/vàng cho cảnh báo hoặc điểm nhấn giá tiền.
- Font: `'Plus Jakarta Sans'` cho nội dung, `'JetBrains Mono'` cho số liệu dạng mono nếu cần.
- Logo dùng file `Uninest_1_-_logo-removebg-preview.png` (nền trong suốt) — không dùng lại `Uninest 1 - logo.png` (nền trắng ngà) cho logo hiển thị trên nền tối/canvas.
- Avatar người dùng trong canvas luôn vẽ dạng vòng tròn màu + chữ cái đầu (initials), không dùng ảnh chân dung thật — tránh phụ thuộc file ảnh có thể thiếu/lỗi khi vẽ trên canvas.
