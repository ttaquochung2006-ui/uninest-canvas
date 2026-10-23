# UNINEST Canvas Studio

Prototype UI canvas tương tác cho đồ án UNINEST — nền tảng tìm phòng trọ minh bạch cho sinh viên tại Việt Nam.

## Chạy thử

Mở file [`uninest_canvas_studio_v11.6.html`](./uninest_canvas_studio_v11.6.html) bằng Chrome hoặc Microsoft Edge. Không cần build step và không cần backend.

Lưu ý: giao diện dùng Tailwind CDN, Google Fonts và Font Awesome CDN, vì vậy một số kiểu chữ/giao diện cần kết nối Internet. Logic dữ liệu và bản đồ là mock/offline.

## Nội dung chính

- Canvas UI dùng chung cho desktop và mobile.
- Tìm/lọc phòng từ 32 dữ liệu mẫu.
- Bản đồ minh hoạ offline, ghép phòng, AI chat mô phỏng và đặt lịch xem.
- Ví tiền trọ, điểm uy tín thanh toán và dashboard chủ trọ.
- Đa ngôn ngữ VI/EN/ZH và tông sáng/tối.
- Các bản lịch sử từ v10.1 đến v11.6 để tham khảo.

## Kiểm thử

Yêu cầu Node.js:

```bash
node tests/v11.6.test.js
node tests/v11.6.browser.js
node tests/v11.6.layout.js
```

Bài browser/layout sẽ tự bỏ qua hoặc hạn chế kiểm tra nếu Microsoft Edge/CDN Tailwind không sẵn có. Đây là prototype trình diễn, không phải ứng dụng production.

## Cấu trúc

- `uninest_canvas_studio_v11.6.html`: phiên bản hiện tại.
- `uninest_canvas_studio_v*.html`: các phiên bản lịch sử.
- `tests/`: kiểm tra hồi quy Node và smoke test Edge.
- `.claude/rules/`: quy ước kiến trúc, dữ liệu, nội dung và kiểm chứng.

## Giấy phép

Chưa công bố giấy phép sử dụng. Mã nguồn được đăng để trình bày/tham khảo dự án UNINEST.