# Dữ liệu: mock-only, không backend

Đây là prototype trực quan (chỉ cần bấm/di chuyển/xem được, giống web app thật) — **không** cần và **không nên** thêm:

- Backend, API thật, hay bất kỳ lời gọi mạng nào (fetch/XHR tới server ngoài)
- Bản đồ thật (Leaflet/OpenStreetMap/Google Maps) hay dịch vụ geocoding thật — bản đồ trong app là hình minh hoạ tự vẽ trên canvas với toạ độ trừu tượng (`mapCoord: {x, y}`), không phải toạ độ GPS
- `localStorage`/`sessionStorage`/cookie hay bất kỳ cách lưu trữ nào sống sót qua lần tải lại trang

Mọi "dữ liệu" của app là **hằng số JS thuần khai báo sẵn trong file** (`ROOMS_DATABASE`, `UNIVERSITIES_LIST`, `MOCK_ACCOUNTS`, `LANDLORD_ROOMS_DATA`, `MOVING_BROKERS`...) cộng với `state` — một object mutable sống trong bộ nhớ, **mất sạch khi tải lại trang**. Đây là hành vi **có chủ đích**, không phải thiếu sót cần sửa.

## Khi thêm dữ liệu mới cần "lưu" trong phiên làm việc

Dùng đúng pattern seed-once-then-reuse đã có sẵn trong file, ví dụ `getRoomReviews(room)`:

```js
function getXxxYyy(key) {
  if (!state.xxxYyyStore[key]) {
    state.xxxYyyStore[key] = [ /* dữ liệu mẫu seed lần đầu */ ];
  }
  return state.xxxYyyStore[key];
}
```

Dữ liệu người dùng nhập vào trong phiên (đánh giá mới, câu trả lời quiz, bộ lọc đã áp dụng...) chỉ cần lưu vào `state`, không cần bền vững hơn thế.

## Mở rộng `ROOMS_DATABASE` / các mảng dữ liệu khác

Khi thêm phần tử mới, giữ đúng toàn bộ shape các field đã có ở các phần tử cũ (kể cả field mới thêm gần đây như `busStopDistanceM`, `nearbyFood`, `mapCoord`) — thiếu field sẽ làm phần lọc/hiển thị liên quan tới field đó âm thầm bỏ qua phần tử này. Mỗi phần tử mới nên có đặc tính khác biệt thật sự (giá, tiện ích, thành phố, category...) thay vì sao chép gần giống nhau, vì mục đích là minh hoạ đa dạng cho demo.
