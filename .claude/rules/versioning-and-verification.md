# Quy ước phiên bản & cách kiểm tra thay đổi

## Đặt tên file

File chính đặt tên `uninest_canvas_studio_v{major}.{minor}.html` (hiện tại: `v11.6`). Khi bắt đầu một đợt nâng cấp/sửa lỗi lớn theo yêu cầu mới của người dùng:

- Nếu người dùng muốn giữ nguyên số phiên bản (chỉ "sửa thêm cho hoàn thiện hơn" một bản đã giao) → sửa trực tiếp trên file hiện tại, không tạo file mới.
- Nếu là một đợt tính năng/nâng cấp mới rõ ràng (ví dụ theo file feedback mới) → copy file phiên bản mới nhất sang tên phiên bản kế tiếp, rồi chỉ chỉnh sửa trên file mới; giữ nguyên file cũ làm bản tham chiếu/rollback.
- Hỏi người dùng nếu không chắc nên tăng version hay sửa tại chỗ.

## Kiểm tra sau khi sửa (không có build step; Edge headless nếu có)

Sau mỗi đợt sửa đáng kể, luôn tự kiểm tra bằng Node trước khi báo hoàn thành:

1. **Cú pháp JS hợp lệ** — trích các khối `<script>...</script>` và chạy `new Function(code)` trên từng khối để bắt lỗi cú pháp sớm:
   ```js
   const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
   scripts.forEach((code, i) => { try { new Function(code); } catch (e) { console.log(i, e.message); } });
   ```
2. **Cân bằng thẻ** — kiểm tra số lượng `<div` vs `</div>`; đây chỉ là kiểm tra sơ bộ, không chứng minh HTML hợp lệ. Không dùng số ngoặc trong toàn file làm bằng chứng cú pháp vì chuỗi, regex và comment có thể chứa ngoặc; dùng bước 1 để phân tích JS.
3. **Không còn tham chiếu treo** — grep tên biến/hàm vừa xoá hoặc đổi tên để chắc chắn không còn nơi nào gọi tới phiên bản cũ.
4. **Với logic tính toán mới** (hàm thuần như `getLandlordStats`, `mapDistanceKm`, `getBrokerPrice`...) — có thể mô phỏng chạy thử bằng cách stub tối thiểu `document`/`window`/`canvas` trong Node rồi `new Function(code + '; return {...cần export...};')()` để gọi thử hàm và so kết quả với kỳ vọng, thay vì chỉ đọc code bằng mắt.

5. **v11.2: kiểm thử hồi quy** — từ thư mục dự án, chạy:
   - `node tests/v11.2.test.js`: cú pháp, 32 phòng mẫu, parser nhiều tiêu chí/giá/khoảng cách, escaping, độc lập bộ lọc, đồng bộ vị trí/đích cuộn (cả reduced motion), nền sinh theo vùng nhìn và vùng bấm ghim.
   - `node tests/v11.2.browser.js`: nếu có Edge, render **132 tổ hợp** (22 màn × 3 ngôn ngữ × 2 tông); kiểm tra zoom/căn giữa, cuộn wheel và giới hạn cuộn, vuốt ngoài map, kéo/chạm ghim sau khi pan/cuộn, huỷ touch, chặn click sau kéo và **10 câu chat** qua DOM trên desktop/mobile. Không có Edge thì script báo `Skipped`, **không được coi là đã kiểm chứng trình duyệt**.
   - Bài Edge chỉ đạt khi tiến trình trả mã 0 và có đúng một node kết quả đã render chứa `BROWSER-SMOKE-OK`, cùng chi tiết `RENDER-COUNT=132; CHAT-CASES=10; MAP/ZOOM/SCROLL/DRAG-CHECKS=OK`. `tests/browser-result.js` bỏ các thẻ script trước khi đọc kết quả, tránh nhận nhầm chuỗi OK trong mã fixture.
   - Fixture dùng tài khoản mẫu thật qua `performLoginSuccess(MOCK_ACCOUNTS.student)`, bỏ CDN/font mạng **chỉ ở bản tạm**, không sửa canvas logic; dùng file/profile tạm rồi xoá, không thêm dependency. Vì không tải Tailwind/font CDN, bài này xác minh hành vi trên canvas/DOM thật, **không xác minh bố cục CSS/font production**.

6. **v11.6: kiểm tra layout khi ẩn thanh Studio:** `node tests/v11.6.test.js` và `node tests/v11.6.browser.js` xác minh logic, render và thao tác. Chạy thêm `node tests/v11.6.layout.js` để so sánh v11.5/v11.6 trên Edge với Tailwind CSS **thật** (12 ca) — không thay thế shell bằng CSS fixture. Bài này cần kết nối CDN Tailwind; khi offline, đặt biến môi trường `UNINEST_TAILWIND_FILE` tới bản sao JavaScript Tailwind CDN đã tải. Kiểm tra dock không bị cắt, ẩn/hiện thật, canvas bám mép trên và zoom tăng rõ rệt ở màn hình lớn. Kích thước viewport thực tế Edge headless có thể khác tham số `--window-size` vài chục pixel.

Cuối cùng vẫn nhắc người dùng xem bằng trình duyệt thật với mắt người: kiểm tra cảm giác kéo, cỡ chữ và bố cục thực tế; smoke test tự động không thay thế đánh giá trực quan.
