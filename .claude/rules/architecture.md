# Kiến trúc canvas-drawn UI

Toàn bộ "màn hình" của app (trang chủ, chi tiết phòng, ghép phòng, bản đồ, các màn chủ trọ...) **không phải DOM/HTML thường** mà được vẽ bằng JS lên một `<canvas id="designCanvas">` duy nhất qua 2D Context API (`ctx.fillRect`, `ctx.fillText`, các helper tự viết như `drawRoundedRect`/`drawBadge`/`drawAvatar`/`drawMapPin`).

## Các thành phần chính

- **`state`** — một object JS thuần giữ toàn bộ trạng thái ứng dụng (đăng nhập, vai trò, màn hình hiện tại, bộ lọc, dữ liệu đang chọn...). Mọi thay đổi UI đều đi qua việc sửa `state` rồi gọi lại render, không có framework reactive nào (không React/Vue).
- **`resizeAndDraw()`** — điểm vào duy nhất để vẽ lại canvas. Dựa vào `state.viewMode` (`'desktop'` | `'mobile'`) để gọi `drawDesktopScreen(w,h)` hoặc `drawMobileScreenWrapper(w,h)`, mỗi cái tự dispatch tới hàm vẽ đúng màn hình qua `switch (state.currentScreen)`.
- **`registerClickZone(x, y, w, h, onClick, label)`** — cơ chế hit-testing thủ công. Mỗi hàm vẽ phải tự đăng ký vùng bấm ngay sau khi vẽ nút/thẻ tương ứng; các vùng này được gom vào mảng `interactiveZones`, xoá và build lại mỗi lần `resizeAndDraw()`.
- **Modal (popup)** — đây là phần DUY NHẤT thực sự là DOM thật (`<div class="fixed inset-0 ...">`), dùng chung cho cả desktop lẫn mobile vì chúng nổi đè lên canvas bất kể chế độ xem nào. Quy ước mở/đóng modal mới: `classList.remove('hidden')` rồi `setTimeout(() => classList.remove('opacity-0'), 10)` khi mở; ngược lại khi đóng — xem các modal gần đây (`bookingModal`, `movingModal`, `lifestyleQuizModal`) làm mẫu.
- **`SIZES`** — kích thước canvas logic cố định cho từng chế độ (`desktop: 1400x860`, `mobile: 400x820`), không đổi theo cửa sổ trình duyệt; việc phóng to/thu nhỏ chỉ là CSS scale qua `state.zoom`.

## Khi thêm nút bấm mới trên canvas

Luôn theo đúng thứ tự: vẽ hình dạng (`drawRoundedRect`/`ctx.fillText`...) → gọi `registerClickZone(...)` ngay sau đó với callback xử lý. Nếu một hàm vẽ bị lỗi/throw giữa chừng, các `registerClickZone` phía sau trong cùng lượt vẽ sẽ không được đăng ký — đây từng là nguyên nhân gây mất nút bấm khi có lỗi JS ở phần trên màn hình (ví dụ lỗi khi vẽ avatar làm hỏng toàn bộ phần còn lại của màn hình đó).
