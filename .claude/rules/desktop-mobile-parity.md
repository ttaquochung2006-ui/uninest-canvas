# Bắt buộc: không hand-duplicate nội dung giữa desktop và mobile

Đây là quy tắc quan trọng nhất của dự án, rút ra từ các bug thật đã xảy ra.

Mỗi màn hình có **hai hàm vẽ hoàn toàn tách biệt** — một cho desktop, một cho mobile (ví dụ `drawScreen1_Home` ↔ `drawMobileScreen0_Home`, `drawScreen3_Match` ↔ `drawMobileScreen2_Match`, `drawLandlordScreen3_Rubric` ↔ `drawMobileLandlord2_Rubric`). Đây không phải responsive layout dùng chung — là hai đoạn code viết tay riêng biệt cho cùng một nội dung.

**Hệ quả**: nếu một hàm tự khai báo mảng/số liệu/văn bản riêng thay vì đọc từ nguồn chung, desktop và mobile sẽ lệch nhau ngay khi có ai sửa một bên mà quên sửa bên kia — đây chính xác là nguyên nhân của nhiều bug đã gặp (ví dụ: rubric tiêu chí đánh giá bị lệch điểm số, danh sách ứng viên ghép phòng có nội dung khác nhau giữa 2 chế độ, thống kê doanh thu chỉ có ở web mà mobile không có).

## Cách làm đúng

Mọi dữ liệu/nội dung mà cả desktop và mobile đều cần hiển thị **phải** nằm trong một nguồn dùng chung duy nhất — hằng số cấp module hoặc hàm thuần (pure function) — rồi cả hai hàm vẽ cùng đọc từ đó:

- Mảng dữ liệu: `ROOM_RUBRIC_CRITERIA`, `LANDLORD_RUBRIC_CRITERIA`, `CANDIDATES`, `MOVING_BROKERS`...
- Hàm tính toán dùng chung: `getFilteredRooms()`, `getMapFilteredRooms()`, `getRankedCandidates()`, `getLandlordStats()`, `computeMatchScore()`, `mapDistanceKm()`...
- Hàm lấy dữ liệu có seed/lazy-init: `getRoomReviews(room)`, `getBrokerReviews(broker)` — seed dữ liệu mẫu vào `state.roomReviews[room.id]` một lần rồi tái sử dụng.

Khi thêm tính năng mới có cả 2 phiên bản desktop/mobile: viết hàm/mảng dùng chung trước, sau đó cả hai hàm vẽ chỉ gọi ra và tự lo phần bố cục/kích thước khác nhau (vì màn hình rộng/hẹp khác nhau) — KHÔNG được copy nội dung/số liệu bằng tay lần thứ hai.
