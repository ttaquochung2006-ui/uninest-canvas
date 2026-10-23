# UNINEST Canvas Studio

Bộ mockup HTML/CSS/JS trực quan (clickable) cho đồ án sinh viên UNINEST — nền tảng tìm phòng trọ minh bạch cho sinh viên tại Việt Nam. Đây là **prototype trình diễn**, không phải phần mềm production.

Xem chi tiết theo từng chủ đề trong `.claude/rules/`:

- `architecture.md` — cách toàn bộ UI được vẽ trên canvas, `state`, vòng lặp render
- `desktop-mobile-parity.md` — nguyên tắc bắt buộc để desktop/mobile không lệch nội dung
- `data-and-persistence.md` — dữ liệu mock, không backend, không lưu trữ thật
- `versioning-and-verification.md` — quy ước đặt tên file phiên bản & cách kiểm tra thay đổi khi không có trình duyệt
- `content-style.md` — ngôn ngữ, persona, phong cách giao diện

File chính hiện tại: `uninest_canvas_studio_v11.6.html` (single-file, tự chứa toàn bộ HTML/CSS/JS).

**Ghi chú hiện hành v11.6 (06/10/2026):** Khi ẩn thanh Studio, khung canvas tự phóng theo không gian thật, bám sát mép trên (12px ở màn rộng). Sửa CSS co thanh Studio về đúng 0px, bỏ dải đen 52px; dock chỉ chừa đệm khi va chạm canvas. v11.5 vẫn được giữ để so sánh. Kiểm tra: `node tests/v11.6.test.js`, `node tests/v11.6.browser.js`, `node tests/v11.6.layout.js` (bài cuối cần Edge và Tailwind CDN hoặc biến `UNINEST_TAILWIND_FILE` trỏ đến bản JS CDN đã tải). Số liệu trước v11.6 ở dưới là lịch sử.

**Ghi chú hiện hành v11.2 (06/10/2026):** Chat tìm trọ offline đã lọc nhiều tiêu chí từ 32 phòng mẫu, hiển thị tối đa 5 gợi ý và không sửa bộ lọc trang chủ. Bản đồ tự sinh phố khi pan xa, desktop rộng 70% × cao 680px, mobile cao 520px; kéo chuột và vuốt một ngón hoạt động trên cả hai chế độ, ghim bấm đúng sau khi kéo. Chạy `node tests/v11.2.test.js` và `node tests/v11.2.browser.js` để kiểm tra. Các đoạn dưới ghi rõ v11.0/2026-09-20 là mốc lịch sử, **không phải mô tả khả năng hiện tại** (đặc biệt mục hoãn kéo map mobile).

---

## Tiến độ dự án (cập nhật 2026-09-20)

### Đã hoàn thành

**v10.1 → v10.2 (sửa lỗi nền tảng + tính năng mới):**
- Sửa 2 lỗi nghiêm trọng khiến v10.2 bị lỗi: thẻ `<img>` thiếu tên tag trong `#personaCard` gây in chữ rác ra UI, và biến `studentPhoto` chưa khai báo trong `drawAvatar()` gây `ReferenceError` làm hỏng cả lượt vẽ.
- Đổi persona "Minh Anh" → "Quốc Anh" nhất quán toàn bộ file (DOM + cả 2 pipeline vẽ canvas).
- Đổi logo sang bản nền trong suốt.
- Đồng bộ desktop/mobile: gộp rubric về đúng 5 tiêu chí dùng chung, gộp danh sách ứng viên ghép phòng vào 1 nguồn, bổ sung tab "Toàn Cảnh" còn thiếu trên mobile.
- Thêm 4 tính năng: bộ lọc xe buýt/ẩm thực, quiz ghép phòng tính % tương thích thật, lưu đánh giá mới trong phiên làm việc (cả 2 chế độ xem).

**v10.2 → v10.3 (theo file feedback của người dùng):**
- Tính năng đặt dịch vụ chuyển trọ: so sánh giá 4 đơn vị vận chuyển theo khoảng cách, chat mô phỏng, đánh giá dịch vụ.
- Nâng cấp bản đồ: tìm kiếm khu vực/trường (có gợi ý), lọc theo bán kính, kích hoạt lại trường `mapCoord` (trước đó có nhưng không dùng).
- Mở rộng `ROOMS_DATABASE` từ 6 lên **32 phòng**, trải qua 5 tỉnh/thành, nhiều chủ trọ khác nhau.
- Thêm thẻ "Doanh Thu Tháng" còn thiếu trên bản mobile của chủ trọ, tính từ cùng 1 hàm dùng chung với desktop.

**Hoàn thiện thêm trên v10.3 (cùng ngày):**
- Sửa triệt để lỗi AI Chat làm hỏng bộ lọc (không xem lại được "tất cả phòng" sau khi hỏi AI) — tách AI hoàn toàn khỏi state bộ lọc chính.
- Bản đồ: phóng to đáng kể (desktop 500→640px, mobile 190→320px), nền minh hoạ đổi theo đúng tỉnh/thành đang xem thay vì luôn mang tên đường TP.HCM.
- Thêm cơ chế "nháp → Áp Dụng/Huỷ" cho bộ lọc trang chủ (tỉnh/thành, trường, tiện ích, xe buýt, ẩm thực).
- Tạo `AGENTS.md` + `.Codex/rules/` cho dự án (tài liệu này).

**v10.4 (người dùng tự chỉnh tay):**
- Rút gọn `<title>` và badge phiên bản trong header cho gọn bố cục. Không đổi logic/tính năng.

**v10.4 → v10.5 (4 yêu cầu cải tiến giao diện):**
- Màn hình tải dữ liệu giả lập khi vừa vào web (~3.5s, có nút "Bỏ qua"): logo UNINEST trên thẻ trắng có quầng sáng + vòng nét đứt xoay, danh sách 12 gói dữ liệu lần lượt báo "xong", thanh tiến trình và dòng trạng thái chạy chữ.
- Thiết kế lại màn hình cổng xác thực (trước đăng nhập): thêm dải hero có **logo UNINEST**, tên thương hiệu, khẩu hiệu, 3 con số đếm tăng dần, và dải "quy trình 4 bước" ở cuối trang. Bản mobile dùng chung nội dung qua `GATEWAY_HERO` / `GATEWAY_STATS` / `GATEWAY_STEPS`.
- Thêm động cơ animation cho canvas (`startAnimLoop`, `bumpAnim`, `screenEnterProgress`): hiệu ứng nội dung hiện lên khi đổi màn hình, quầng sáng trôi + hạt bay trong hero, vệt sáng quét qua nút, tô đậm nút khi rê chuột. Kèm animation CSS cho phần DOM (modal trượt + phóng nhẹ, logo nổi, đốm sáng nhấp nháy).
- Thêm nút tròn **"?"** nổi ở góc phải dưới màn hình (cả desktop lẫn mobile) + nút "?" trên thanh công cụ + phím tắt `?`, mở bảng **hướng dẫn sử dụng chi tiết** 3 tab, nội dung nằm trong hằng số dùng chung `HELP_GUIDE` (lúc đó: SV 7 mục / Chủ trọ 5 / Mẹo chung 7 — số hiện tại xem bảng trạng thái bên dưới).

**v10.5 → v10.6 (quản lý tiền trọ & điểm uy tín thanh toán):**
- **Sửa lỗi nền tảng**: `registerClickZone()` nay cộng thêm `zoneOffsetY` (= `-scrollY`) nên vùng bấm khớp đúng vị trí nhìn thấy khi màn hình đã cuộn. Trước v10.6, mọi nút nằm dưới vùng cuộn đều bấm lệch đúng bằng số pixel đã cuộn.
- **Chủ trọ — bảng điều khiển**: thêm thẻ "Đã thu tháng", **heatmap tiền trọ 12 tháng** (mỗi ô một tháng, màu theo tình trạng thu; bấm mở chi tiết ai đóng/ai nợ), panel "Giao dịch gần đây", và **bảng nhắc nhở/cảnh báo** người thuê chưa đóng (soạn sẵn tin Zalo/SMS + nút "✓ Đã Thu" cập nhật heatmap ngay).
- **Sinh viên — màn hình mới "Ví Tiền Trọ & Điểm Uy Tín"** (tab thứ 6, `drawScreen7_RentWallet` / `drawMobileScreen5_RentWallet`): hợp đồng đang thuê, kỳ thanh toán tháng này kèm nút đóng tiền, lịch sử 12 tháng dạng heatmap, chi tiết từng kỳ và mẹo giữ điểm.
- **Điểm uy tín thanh toán** (`getTrustScore`): công thức công khai — trừ theo số tháng trễ, số ngày trễ, tháng còn nợ; cộng thưởng chuỗi tháng đúng hạn. Hiển thị ở màn sinh viên **và** ngay trên thẻ yêu cầu hẹn xem phòng phía chủ trọ để chủ trọ kiểm tra trước khi duyệt.
- Nguồn dữ liệu dùng chung: `getRentLedger` (seed 1 lần), `getLandlordMonthlyRent`, `getTenantRentStatus`, `getRecentRentTransactions`, `getStudentRentHistory`, `getTrustScore` — desktop và mobile đều đọc từ đây.

**v10.6 → v10.7 (đa ngôn ngữ & tông màu sáng/tối):**
- **Đổi ngôn ngữ VI / EN / ZH** qua ô chọn trên thanh công cụ. Cơ chế: bọc lại `ctx.fillText` và `ctx.measureText` một lần duy nhất để mọi chữ trên canvas tự đi qua hàm `t()`; phần DOM dùng `translateDomNode` + `MutationObserver` nên nội dung sinh động (modal, tab, toast) cũng được dịch mà không phải gọi tay ở từng chỗ render.
- Từ điển `I18N` **lấy nguyên văn tiếng Việt làm khoá** (705 khoá × 2 ngôn ngữ), chuỗi nào chưa có sẽ rơi về tiếng Việt chứ không bao giờ hiện rỗng. Chuỗi có chèn số liệu (số phòng, ngày, tháng) xử lý bằng `I18N_PATTERNS` — regex neo đầu-cuối nên không dịch nhầm một phần.
- **Tông màu tối** qua nút trên thanh công cụ. Cơ chế: bọc `ctx.fill` / `ctx.fillText` / `ctx.stroke` và ánh xạ màu qua **ba bảng riêng** (nền / chữ / viền). Nhờ tách bảng, `#FFFFFF` dùng làm nền thẻ hoá tối trong khi `#FFFFFF` dùng làm chữ trên nút vẫn giữ trắng.
- Sửa kèm: màu `solid` của các ô heatmap tiền trọ được làm đậm hơn (`#10B981`→`#047857`, `#F59E0B`→`#B45309`, `#94A3B8`→`#64748B`, `#E11D48`→`#BE123C`) để chữ trắng trên đó đạt tương phản ≥ 3:1; emoji trong vòng tròn quy trình được đặt `fillStyle` rõ ràng thay vì thừa hưởng đúng màu nền.

**v10.7 → v10.8 (đưa điều khiển ngôn ngữ & tông màu vào trong giao diện web app):**
- Gỡ `<select id="langSelect">` và `<button id="themeToggleBtn">` khỏi thanh công cụ Studio bên ngoài. Hai điều khiển này nay được **vẽ trên chính canvas**, ở góc trên bên phải thanh điều hướng của web app giả lập, cạnh huy hiệu vai trò và ảnh đại diện.
- Hàm dùng chung mới `drawAppControls(x, y, compact)` + `appControlsWidth(compact)`: dải phân đoạn `[VI|EN|ZH]` (mục đang chọn tô nền teal đậm `#0F766E`, chữ trắng) và nút `[🌙/☀️]`. Desktop dùng bản thường (cao 32px), mobile dùng bản thu gọn (cao 24px) — **cùng một hàm**, chỉ khác cờ `compact`, nên nội dung/hành vi không thể lệch giữa 2 chế độ.
- **Sửa kèm (bắt buộc)**: dải menu điều hướng desktop trước đây dùng khoảng cách cố định 24px. Bản dịch tiếng Anh dài hơn tiếng Việt vừa đủ để mục cuối ("Rent Wallet") **đè lên** cụm điều khiển mới (đo được hở −1px). Dải menu nay tự co khoảng cách (24px → tối thiểu 10px), rồi mới co cỡ chữ (12px → 10px), dựa trên chỗ trống thực tế tới cụm điều khiển.
- Vùng bấm "chạm thanh tiêu đề để đăng nhập" trên mobile (khi chưa đăng nhập) được thu hẹp lại để không nuốt mất nút đổi ngôn ngữ — `interactiveZones` dùng `.find()` nên vùng đăng ký trước sẽ ăn trọn lượt bấm.
- Nội dung bảng hướng dẫn "?" được sửa lại cho khớp vị trí mới (cả 3 ngôn ngữ).

**v10.8 → v10.9 (dọn header Studio + phóng to logo màn hình tải):**
- **Header Studio**: bỏ hẳn `<span id="roleBadgeHeader">` ("• Vai trò: Sinh Viên K51 UEH (19t)") và `<p id="subHeaderHint">` ("Xin chào Quốc Anh! Phân hệ..."). Hai thông tin này đã hiển thị sẵn ở góc phải thanh điều hướng trong giao diện web app nên lặp lại là thừa. Thay bằng dòng ghi công cố định **"Powered by Cuu Long Group"** đặt ngay dưới tên UNINEST, cạnh logo.
- `updateHeaderUI()` rút gọn tương ứng — không còn đọc/ghi 2 phần tử đã gỡ, chỉ còn dựng khối đăng nhập/đăng xuất.
- **Màn hình tải**: bố cục lại thành **lưới 3 cột** `[chữ thương hiệu | LOGO | danh sách gói dữ liệu]`, thanh tiến trình và dòng trạng thái nằm dưới cùng chạy hết chiều ngang. Logo phóng từ **112px lên 244px** (150/186px trên màn hẹp), khung `max-w` nới từ 540px lên 1040px. Dưới 1024px tự xếp dọc với logo lên đầu.
- **Không đụng gì vào giao diện web app** — đã kiểm chứng bằng cách so sánh từng lệnh vẽ canvas của v10.9 với v10.8 trên cả 22 màn hình (849 hình chữ nhật + 1233 đoạn chữ): trùng khớp tuyệt đối.

**v10.9 → v11.0 (logo header + giãn dòng toàn bộ giao diện):**
- **Logo header Studio**: bản cũ dùng `Uninest 1 - logo.png` (nền trắng ngà) đặt trong khung `bg-slate-900` có viền → lộ một ô vuông sáng lệch hẳn với hình logo bên trong. Nay dùng bản nền trong suốt, bỏ hẳn viền/nền khung, phóng từ **32px lên 44px** (header cao 56px). Đây vốn là vi phạm quy ước đã ghi trong `content-style.md`.
- **Bảng Đánh Giá Đa Chiều (rubric)**: bản cũ đặt thanh điểm cách chân chữ tên tiêu chí đúng 3px và dòng ghi chú cách thanh 7px → **chữ đè lên thanh 1px**. Nhịp mới: tên → thanh +11 → ghi chú +26, mỗi tiêu chí cách nhau **40px** (cũ 34px); tiêu đề và dòng phụ của thẻ cũng được nới ra.
- **Các chỗ dính khác đã sửa cùng lúc**: thanh điều hướng web app ("UNINEST" ↔ dòng phân hệ, tên tài khoản ↔ dòng phụ), thẻ đánh giá của sinh viên (tên ↔ "đang ở trọ"), thẻ ghép phòng ("94%" ↔ "MATCH"), vòng điểm uy tín (số điểm đè lên "/ 100"), gạch chân tên thương hiệu ở hero.
- **Công cụ mới `spacing.js`**: đo giãn dòng bằng **hộp chữ thật** (`baseline − cỡ×0.78` đến `baseline + cỡ×0.22`) thay vì khoảng cách baseline, vì khoảng cách baseline là thước đo sai — số 26px với chú thích 10px cách 18px vẫn thoáng, trong khi hai dòng 10px cách 11px thì đã dính. Kết quả: **28 cặp chữ dính + 30 chữ bị thanh đè → 0 và 0**.

### Trạng thái hiện tại của từng phần

Quy mô hiện tại: **32 phòng** trong `ROOMS_DATABASE` (5 tỉnh/thành có dữ liệu thật, danh mục 36 tỉnh/thành, 11 trường), **6 phòng** của Cô Nga trong `LANDLORD_ROOMS_DATA` với **3 người thuê**, **6 màn hình sinh viên** + **4 màn hình chủ trọ**, từ điển dịch **708 khoá × 2 ngôn ngữ**.

| Phần | Trạng thái |
|---|---|
| Duyệt/lọc phòng, đặt lịch xem phòng | Ổn định, đã qua nhiều vòng kiểm tra |
| Bộ lọc trang chủ | Cơ chế nháp → Áp Dụng/Huỷ cho tỉnh/thành, trường, tiện ích, xe buýt, ẩm thực; riêng thanh trượt giá và nút "Xem Tất Cả" lọc tức thời (cố ý) |
| Đánh giá phòng (review) | Hoạt động, lưu trong phiên; huy hiệu "xác thực" **chỉ là minh hoạ**, chưa có luồng upload minh chứng thật |
| Ghép bạn cùng phòng | Đầy đủ: quiz 5 câu → % tương thích thật, đồng bộ desktop/mobile |
| Bản đồ tương tác | Hoạt động (phóng to, tìm khu vực/trường, lọc bán kính); **kéo-thả chuột chỉ có trên desktop**, mobile chưa có |
| Đặt dịch vụ chuyển trọ | Đầy đủ, so sánh giá 4 đơn vị theo khoảng cách ước tính |
| AI tìm trọ | Độc lập hoàn toàn, không còn ảnh hưởng bộ lọc chính |
| Thống kê doanh thu chủ trọ | Khớp desktop/mobile, tính từ `getLandlordStats()` |
| Heatmap & nhắc nhở tiền trọ (chủ trọ) | Hoạt động; kịch bản demo có đủ 3 trạng thái: 1 phòng đã đóng, 1 quá hạn 8 ngày, 1 sắp tới hạn |
| Ví tiền trọ & điểm uy tín (SV) | Hoạt động; Quốc Anh 87/100 ("Tốt"), đóng đúng hạn trong demo tăng lên 88 |
| Màn hình tải giả lập | ~3.5s, có nút "Bỏ qua"; tự bỏ qua khi máy bật `prefers-reduced-motion`. Từ v10.9: lưới 3 cột, logo 244px ở giữa, thanh tiến trình dưới cùng |
| Header Studio (khung ngoài) | Từ v10.9 chỉ còn logo + "UNINEST V11.0" + "Powered by Cuu Long Group". Từ v11.0 logo dùng bản nền trong suốt, 44px, không viền |
| Giãn dòng trên canvas | Từ v11.0: **0** cặp chữ dính dưới 2px và **0** chữ bị thanh/đường kẻ đè, đo trên cả 22 màn hình (trừ nhãn ghim bản đồ — xem "Bước tiếp theo") |
| Animation canvas | Vòng lặp `requestAnimationFrame` chỉ sống ở màn cổng xác thực và ~700ms sau mỗi lần đổi màn hình |
| Hướng dẫn sử dụng "?" | 3 tab: Sinh Viên 8 mục / Chủ Trọ 7 mục / Mẹo Chung 9 mục. Mở bằng nút tròn trên canvas, nút thanh công cụ hoặc phím `?`. Đã dịch đủ 3 ngôn ngữ |
| Đa ngôn ngữ VI / EN / ZH | Hoạt động; **100%** chữ trên canvas và **100%** bảng hướng dẫn đã dịch (danh từ riêng cố ý giữ tiếng Việt). Từ v10.8 điều khiển nằm **trong** giao diện web app |
| Tông màu sáng / tối | Hoạt động; tông tối còn **0** đoạn chữ dưới 3:1, tông sáng gốc còn 132 đoạn (xem "Bước tiếp theo") |
| Cụm điều khiển ngôn ngữ + tông màu (v10.8) | Góc trên bên phải thanh điều hướng web app, cả desktop lẫn mobile, từ cùng hàm `drawAppControls()`. Chữ VI/EN/ZH đo được 5.47–7.31:1 ở cả 2 tông |
| Dải menu điều hướng desktop | Tự co khoảng cách rồi tới cỡ chữ theo chỗ trống còn lại — không còn đè lên cụm điều khiển khi chuyển sang tiếng Anh |
| Vùng bấm khi cuộn trang | Đã sửa từ v10.6 (`zoneOffsetY`); trước đó mọi nút dưới vùng cuộn đều bấm lệch |

#### Mức độ kiểm chứng (quan trọng — đọc trước khi tin vào bảng trên)

| Đã kiểm chứng được bằng Node | Chưa kiểm chứng được |
|---|---|
| Cú pháp JS, cân bằng thẻ HTML/ngoặc, mọi hàm `onclick` đều tồn tại | **Giao diện chạy thật trên trình duyệt** — môi trường agent không có trình duyệt |
| Vẽ thử 22 màn hình (2 vai trò × 2 chế độ) không lỗi runtime, `ctx.save()/restore()` cân bằng | Cảm giác mượt của animation, tốc độ khung hình thực tế |
| Logic thuần: điểm uy tín, doanh thu, ngày trễ/quá hạn — có đối chiếu công thức tính tay và giá trị biên | Font chữ tiếng Trung hiển thị có bị vỡ/thiếu glyph không |
| Vùng bấm: không tràn khung, không chồng lấn, dịch đúng theo độ cuộn | Bố cục thực tế có bị tràn/chồng chữ khi font render thật không |
| Độ phủ dịch: đếm từng chuỗi vẽ ra canvas + từng mục hướng dẫn | Chất lượng hành văn bản dịch dưới mắt người bản xứ |
| Độ tương phản WCAG của **1127 đoạn chữ** trên nền thực tế của chúng, ở cả 2 tông màu | Màu sắc cảm quan (hài hoà/chói mắt) trên màn hình thật |
| Cụm điều khiển v10.8: có mặt ở đủ 22 lượt vẽ, nằm trong dải thanh điều hướng, bấm thật sự đổi được ngôn ngữ/tông màu, không chồng lấn ở **cả 3 ngôn ngữ** | Bề rộng chữ thật của trình duyệt (kiểm thử dùng ước lượng ~6.2px/ký tự) — khoảng hở hẹp nhất đo được chỉ 16px nên cần nhìn tận mắt |
| Sửa header/màn hình tải KHÔNG làm đổi giao diện web app — so từng lệnh vẽ canvas giữa 2 phiên bản (`diff_render.js`, đóng băng `performance.now()` để animation không gây nhiễu) | Bố cục thật của màn hình tải: lưới 3 cột và logo 244px mới chỉ kiểm chứng qua cấu trúc HTML/lớp Tailwind, chưa thấy tận mắt |
| Giãn dòng: khoảng hở giữa mọi cặp chữ và giữa chữ với thanh/đường kẻ, có tính `ctx.clip()` và phần bị mảng đặc che (`spacing.js`) | Bề ngang chữ thật — vẫn ước lượng `số ký tự × cỡ chữ × 0.52`, nên chỉ bắt được lỗi theo **chiều dọc**, không bắt được chữ bị tràn ngang |

Các script kiểm thử này được viết trong thư mục tạm của phiên làm việc nên **sẽ mất khi phiên kết thúc** — xem "Bước tiếp theo" mục 4.

### Bước tiếp theo cần làm

1. **Mở `uninest_canvas_studio_v11.0.html` bằng Chrome/Edge và kiểm thử trực quan** — việc quan trọng nhất còn thiếu. Cần nhìn tận mắt: màn hình tải lúc vào, hero cổng xác thực, đổi VI→EN→ZH (nhất là tiếng Trung có thiếu font không), bật/tắt tông tối ở **màn bản đồ và màn heatmap** (hai chỗ nhiều màu nhất), và luồng chủ trọ "Cảnh Báo → gửi → ✓ Đã Thu" xem heatmap có đổi màu đúng không.
   - **Riêng cho v10.8**: xem kỹ thanh điều hướng desktop ở **tiếng Anh, vai trò sinh viên** (6 mục menu, chuỗi dài nhất). Kiểm thử chỉ ước lượng bề rộng chữ nên khoảng hở 16px có thể khác trên font thật; nếu thấy chật, giảm `menuLimit` trong `drawWebHeader` (hiện `ctrlX - 16`).
   - **Riêng cho v10.9**: xem màn hình tải trên **cửa sổ hẹp (< 1024px)** — lúc đó lưới xếp dọc thành logo + chữ + 12 dòng gói dữ liệu, cao khoảng 580px. `#bootLoader` dùng `overflow-hidden` nên nếu cửa sổ thấp hơn thì dòng trạng thái dưới cùng sẽ bị cắt. Nếu gặp, giảm logo ở breakpoint nhỏ hoặc rút bớt số gói hiển thị.
2. **Nhãn ghim trên bản đồ mobile vẫn có thể chồng nhau** — ví dụ ghim trường "🎓" đè lên nhãn phòng "Studio Ban Côn…". Đây không phải lỗi giãn dòng mà do **toạ độ dữ liệu** đặt hai ghim quá gần; sửa đúng cách là thêm thuật toán tránh va chạm khi xếp nhãn ghim. Cố ý để lại và đã loại khỏi bài kiểm thử giãn dòng (có ghi rõ lý do trong `test_v110.js`).
3. **Tông SÁNG gốc còn 130 đoạn chữ dưới 3:1** (đã đo, tông tối đã về 0). Các lỗi rõ nhất: chữ trắng trên nền `#F8FAFC`, chữ trắng trên nền `#DCFCE7`/`#E9ECEF`, chữ `#94A3B8` trên nền trắng. Nếu muốn, dọn nốt để bản sáng cũng đạt chuẩn.
4. **Bộ kiểm thử Node đang nằm ở thư mục tạm và sẽ mất.** Nó đo được độ phủ dịch + tương phản WCAG + hình học vùng bấm — nên chuyển vào repo (ví dụ `tests/`) nếu muốn dùng lại cho các bản sau.
5. **Cập nhật `.Codex/rules/versioning-and-verification.md`** — file đó mới chỉ mô tả kiểm tra cú pháp, chưa phản ánh cách kiểm thử hành vi hiện đang dùng.
6. Còn treo (cố ý hoãn, xem lý do bên dưới): kéo-thả bản đồ trên mobile; biến thể tông sáng cho khung Studio bao quanh.
7. Phần trong `DETAILS.docx` gốc chưa triển khai: luồng upload minh chứng thuê phòng thật để xác thực người đánh giá; nhắn tin trực tiếp giữa 2 sinh viên ghép phòng (hiện chỉ có mẫu cam kết + AI chat chung).

### Quyết định quan trọng & lý do

**Kiến trúc & dữ liệu**

- **Giữ nguyên kiến trúc canvas-drawn UI** xuyên suốt mọi tính năng mới, không chuyển phần nào sang DOM/React — nhất quán với codebase hiện có, tránh rủi ro tái cấu trúc lớn không cần thiết cho một bản demo.
- **Bản đồ giữ dạng minh hoạ cách điệu (offline)**, không tích hợp Leaflet/OpenStreetMap thật — giữ triết lý "nhẹ, không phụ thuộc API ngoài", tránh cần internet khi thuyết trình. Đổi lại, khoảng cách/bán kính chỉ là ước tính quy đổi từ toạ độ trừu tượng, không chính xác theo GPS.
- **Mở rộng lên 32 phòng** thay vì ít hơn — người dùng chọn mức "nhiều" để canvas trông đầy đủ như sản phẩm thật khi trình bày.
- **Màn hình tải là DOM/CSS thuần, không vẽ trên canvas** — nó phải phủ toàn bộ cửa sổ (kể cả header và thanh công cụ), trong khi canvas chỉ là một khung kích thước cố định nằm giữa trang.

**Hiệu năng & cách vẽ**

- **Vòng lặp animation chạy có điều kiện, không chạy vĩnh viễn** — `shouldKeepAnimating()` chỉ cho vẽ lại liên tục ở màn cổng xác thực (cảnh nhẹ) và ~700ms sau khi đổi màn hình. Nếu chạy 60fps ở mọi màn, màn bản đồ nhiều lớp sẽ có nguy cơ giật khi thuyết trình trên máy yếu.
- **`resizeAndDraw()` chỉ gán lại `canvas.width/height` khi kích thước thật sự đổi** — gán mỗi khung hình buộc trình duyệt cấp phát lại buffer, gây giật vòng lặp animation.
- **Hiệu ứng "hiện lên" khi đổi màn hình dùng lớp phủ mờ dần, không dùng `ctx.globalAlpha`** — vì có hàm vẽ bên trong (vòng bán kính ở màn bản đồ) tự đặt lại `globalAlpha = 1` giữa chừng, làm hỏng hiệu ứng nếu dùng alpha toàn cục.
- **Dịch thuật và đổi màu đều làm ở tầng bọc `ctx`, không sửa từng chỗ gọi** — codebase có ~580 chuỗi và ~70 màu rải khắp hàng trăm lệnh vẽ; sửa tay từng chỗ vừa dễ sót vừa dễ gây lỗi. Bọc `fillText`/`fill`/`stroke`/`measureText` một lần cho kết quả phủ 100% mà không đụng vào logic vẽ sẵn có.
- **Bảng màu tối tách riêng "nền" và "chữ"** — nếu dùng chung một bảng thì `#FFFFFF` vừa là nền thẻ (cần hoá tối) vừa là chữ trên nút teal (cần giữ trắng); đổi kiểu nào cũng sai một nửa.

**Tương tác & trải nghiệm**

- **Bộ lọc dạng "nháp → Áp Dụng/Huỷ"** cho các lựa chọn-từ-danh-sách; **riêng thanh trượt giá và nút "Xem Tất Cả" lọc tức thời** — đó là tương tác kéo-thả/bật-tắt tự nhiên cần phản hồi ngay, khác bản chất với "chọn rồi mới chạy".
- **AI tìm trọ tách biệt hoàn toàn khỏi state bộ lọc chính** — nguyên nhân gốc của bug "không xem lại được tất cả phòng sau khi hỏi AI" là AI ghi đè cùng biến với bộ lọc thật. Nay AI tự tính gợi ý riêng, hiển thị trong khung chat, không đụng bộ lọc trang chủ.
- **Không kéo-thả bản đồ trên mobile** — mobile dùng `mobileScrollY` cuộn toàn màn hình; thêm kéo-thả đòi hỏi tính vị trí theo scroll offset động, rủi ro xung đột với gesture cuộn cao hơn lợi ích.
- **Khung Studio bao quanh giữ nguyên tông tối ở cả hai chế độ** — nó là "vỏ công cụ", không phải web app đang mô phỏng; chỉ phần canvas (website giả lập) mới đổi sáng/tối.
- **Điều khiển ngôn ngữ + tông màu nằm TRONG giao diện web app, không nằm ở thanh công cụ Studio** (v10.8) — đây là tính năng của chính sản phẩm UNINEST, không phải tiện ích của công cụ demo; để ở ngoài thì khi thuyết trình/chụp màn hình nó trông như thứ của Studio chứ không phải của web app.
- **Dùng dải phân đoạn `[VI|EN|ZH]` thay vì hộp thả xuống (dropdown)** — canvas không có widget sẵn, tự vẽ dropdown phải quản lý thêm trạng thái đóng/mở, lớp vẽ đè và vùng bấm ngoài để đóng. Ba nút cạnh nhau cho thấy luôn đang ở ngôn ngữ nào, một lần bấm là xong.
- **Header Studio không lặp lại thông tin đã có trong web app** (v10.9) — vai trò và lời chào vốn hiển thị ở cả hai nơi; bỏ ở khung ngoài để chỗ đó dành cho ghi công "Powered by Cuu Long Group", đồng thời giảm nhiễu khi chụp màn hình thuyết trình.
- **Đo giãn dòng bằng hộp chữ, không bằng khoảng cách baseline** (v11.0) — khoảng cách baseline cho kết quả sai lệch: số 26px với chú thích 10px cách nhau 18px trông vẫn thoáng, trong khi hai dòng 10px cách 11px thì đã dính. Chỉ khi quy về hộp chữ thật mới so sánh được các cỡ chữ khác nhau trên cùng một thước đo.
- **Nhãn ghim bản đồ cố ý không đưa vào bài kiểm thử giãn dòng** (v11.0) — ghim chồng nhau là do toạ độ dữ liệu, phải giải bằng thuật toán tránh va chạm khi xếp nhãn, không phải bằng cách nới khoảng cách dòng. Gộp chung sẽ làm bài kiểm thử không bao giờ xanh được vì lý do sai.
- **Logo màn hình tải đặt ở cột giữa thay vì xếp dọc** (v10.9) — muốn logo thật lớn (244px) mà vẫn giữ đủ danh sách 12 gói dữ liệu và thanh tiến trình trong một màn, thì phải dùng chiều ngang thay vì chiều dọc. Thanh tiến trình cố ý nằm **ngoài** lưới 3 cột để kéo dài hết bề ngang, đúng kiểu màn hình khởi động quen thuộc.
- **Dải menu desktop tự co thay vì cố định 24px** — cùng một mục menu có bề rộng khác nhau ở VI/EN/ZH. Số cố định chỉ đúng với tiếng Việt: bản tiếng Anh đo được đè lên cụm điều khiển 1px. Co khoảng cách trước, cỡ chữ sau, vì giảm khoảng cách ít gây chú ý hơn giảm cỡ chữ.

**Nội dung, persona & ngôn ngữ**

- **Avatar chỉ dùng chữ cái đầu, không dùng ảnh chân dung thật** — tránh phụ thuộc file ảnh có thể thiếu/lỗi tải trên canvas; đơn giản và ổn định hơn.
- **Logo trên canvas luôn dùng bản `Uninest_1_-_logo-removebg-preview.png`**, kể cả khi người dùng nhắc tên file `Uninest 1 - logo.png` — bản nền trắng ngà sẽ lộ viền vuông khi đặt trên thẻ trắng/nền tối của hero và màn hình tải. Nội dung logo hai file giống hệt nhau.
- **Quốc Anh đang thuê trọ ở một chủ trọ khác (Chú Bảy), không phải phòng của Cô Nga** — bạn ấy cần lịch sử đóng tiền để sinh ra điểm uy tín, trong khi vẫn đang đi tìm chỗ mới (khớp với luồng tìm trọ + chuyển trọ sẵn có). Nhờ vậy Cô Nga mới có vai "người kiểm tra điểm uy tín của ứng viên thuê".
- **Chỉ có 3 người thuê của Cô Nga (phòng 101/102/105)** — đúng bằng 3 phòng "Đang cho thuê", để tổng tiền trong heatmap luôn khớp `getLandlordStats().revenue` = 9.100.000 đ đã hiển thị từ các bản trước. Phòng 103 "Còn trống 1 suất" cố ý không gán người thuê vì hàm đó không tính nó vào doanh thu.
- **Công thức điểm uy tín để lộ hoàn toàn cho người dùng** (`TRUST_RULES` + bảng "Cách tính điểm" trong modal) — đây là đồ án về **minh bạch**, nên điểm số phải giải thích được chứ không phải hộp đen.
- **Danh từ riêng không dịch** (tên người, tên phòng trọ, tên đường, tên trường, tên tỉnh/thành) — đây là tên thật của địa điểm tại Việt Nam, dịch ra sẽ sai lệch thông tin; giống cách Airbnb giữ nguyên tiêu đề tin đăng theo ngôn ngữ chủ nhà.
- **Chuỗi thiếu bản dịch rơi về tiếng Việt, không bao giờ hiện rỗng** — thà hiện tiếng Việt còn hơn để trống chỗ đó khi thuyết trình.
- **Màu ô heatmap tiền trọ được làm đậm hơn bản gốc** (`#10B981`→`#047857`, `#F59E0B`→`#B45309`, `#94A3B8`→`#64748B`, `#E11D48`→`#BE123C`) — bản gốc có chữ trắng trên nền cam chỉ đạt 2.15:1, khó đọc ngay ở tông sáng. Đây là thay đổi ngoài phạm vi yêu cầu nhưng sửa một lỗi đọc thật.
