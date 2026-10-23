# UNINEST — Lịch sử cải tiến theo nhu cầu người dùng

**Từ v10.1 đến v11.2** · Cập nhật 06/10/2026 · Đồ án nền tảng tìm phòng trọ minh bạch cho sinh viên Việt Nam

---

## Tài liệu này ghi gì

Chỉ ghi **những cải tiến giải quyết một nhu cầu thật của người dùng** — chủ yếu là sinh viên đi thuê trọ, và phần đối ứng bên chủ trọ.

Cố ý **không** ghi các đợt chỉnh sửa thuần về hình thức: bố cục, cỡ chữ, giãn dòng, màu sắc, animation, vị trí nút. Những đợt đó (v10.4, v10.8, v10.9, v11.0 và phần lớn v10.5) tuy chiếm nhiều công sức nhưng không thêm khả năng mới nào cho người dùng — chi tiết nằm trong `CLAUDE.md`.

Mọi con số trong tài liệu đã được đối chiếu trực tiếp với mã nguồn của từng phiên bản (xem **Phụ lục A**), không chép lại theo trí nhớ.

---

## 1. Vấn đề gốc mà sinh viên gặp phải

UNINEST sinh ra từ năm nỗi đau cụ thể khi sinh viên đi thuê trọ:

| # | Nỗi đau | Hệ quả |
|---|---|---|
| 1 | **Giá ảo, phí ẩn** — tin đăng ghi 2.5 triệu nhưng điện 4.000đ/kWh, nước tính đầu người, phí xe, phí rác | Tiền thật cao hơn nhiều so với tin đăng |
| 2 | **Không biết chủ trọ tốt hay xấu** trước khi ký hợp đồng | Mất cọc, bị vào phòng không báo, sửa chữa ì ạch |
| 3 | **Môi giới ảo** — ảnh đẹp không đúng phòng, đến nơi mới biết | Mất thời gian, mất phí xem phòng |
| 4 | **Ở ghép với người lệch giờ giấc / lối sống** | Ở được vài tháng phải chuyển, mất cọc lần nữa |
| 5 | **Chuyển trọ bị hét giá** vì không có cơ sở so sánh | Một lần chuyển tốn bằng nửa tháng tiền phòng |

Toàn bộ lộ trình cải tiến bên dưới bám theo năm nỗi đau này.

---

## 2. Dòng thời gian tóm tắt

| Phiên bản | Nhu cầu được giải quyết | Phục vụ ai |
|---|---|---|
| **v10.1** | Nền móng: duyệt phòng, xem rubric đánh giá, đặt lịch xem phòng | SV + Chủ trọ |
| **v10.2** | Lọc theo **xe buýt & ẩm thực gần đó**; **ghép bạn ở ghép** bằng trắc nghiệm lối sống; sinh viên **tự viết đánh giá** | Sinh viên |
| **v10.3** | **Đặt dịch vụ chuyển trọ** (so giá 4 đơn vị); **bản đồ tìm theo khu vực / trường + bán kính**; mở rộng từ 6 lên **32 phòng / 5 tỉnh thành** | Sinh viên |
| **v10.5** | **Hướng dẫn sử dụng chi tiết** cho cả hai vai trò | SV + Chủ trọ |
| **v10.6** | **Ví tiền trọ, lịch sử đóng tiền và điểm uy tín thanh toán**; chủ trọ có **heatmap thu tiền + nhắc nhở người chưa đóng** | SV + Chủ trọ |
| **v10.7** | **Ba ngôn ngữ Việt / Anh / Trung** cho sinh viên quốc tế | Sinh viên |
| **v11.2** | **Chat tìm phòng theo nhiều điều kiện cùng lúc** từ dữ liệu mẫu; **bản đồ kéo liên tục trên desktop/mobile**, ghim bấm đúng sau khi kéo | Sinh viên |
| v10.4, v10.8, v10.9, v11.0, v11.1 | *(chỉ hình thức — không thuộc phạm vi tài liệu này)* | — |

---

## 3. Chi tiết theo từng nhóm nhu cầu

### 3.1 — "Làm sao biết phòng này có thật sự minh bạch không?"

**Có từ v10.1, hoàn thiện ở v10.2**

Đây là trụ cột của cả dự án. Mỗi phòng có một **Bảng Đánh Giá Đa Chiều (Rubric)** gồm đúng 5 tiêu chí, do chính sinh viên từng ở chấm:

1. Thái độ chủ trọ & tôn trọng riêng tư
2. Minh bạch chi phí (Điện, Nước, Xe)
3. Cơ sở vật chất & độ bền thiết bị
4. An ninh khu vực & hoàn cọc đúng hẹn
5. Độ cách âm / yên tĩnh khu trọ

Khác biệt so với đánh giá sao thông thường: rubric **tách bạch từng khía cạnh**, nên một phòng đẹp nhưng chủ trọ khó tính không thể "giấu" sau điểm trung bình cao. Mỗi tiêu chí kèm một dòng ghi chú cụ thể ("Công tơ riêng tử tế, chụp hình báo Zalo mùng 1 hàng tháng") thay vì chỉ có con số.

Ở **v10.2**, sinh viên được **tự viết đánh giá ẩn danh** ngay trong phiên sử dụng, và đánh giá mới hiện ra ngay ở cả hai chế độ xem. Trước đó danh sách đánh giá là cố định, người dùng chỉ đọc chứ không đóng góp được.

> **Giới hạn cần nói rõ:** huy hiệu "✓ Đã Xác Minh Cọc" / "✓ Xác Minh Hóa Đơn" hiện **chỉ là minh hoạ**. Luồng upload ảnh hợp đồng / hoá đơn thật để xác thực người đánh giá **chưa được triển khai** — đây là phần quan trọng nhất còn thiếu của trụ cột minh bạch.

---

### 3.2 — "Trọ rẻ nhưng đi học xa, ăn uống đắt thì cũng vô nghĩa"

**v10.2 — bộ lọc xe buýt & ẩm thực**

Sinh viên không chỉ chọn phòng theo giá. Hai chi phí ẩn lớn nhất sau tiền phòng là **đi lại** và **ăn uống**. Vì vậy mỗi phòng được bổ sung hai trường dữ liệu mới:

- `busStopDistanceM` — khoảng cách tới trạm xe buýt gần nhất, tính bằng mét
- `nearbyFood` — loại ẩm thực quanh đó (cơm bình dân, chợ / siêu thị, phố ẩm thực...)

Và hai bộ lọc tương ứng trên trang chủ. Nhờ đó câu hỏi thật của sinh viên — *"phòng dưới 3 triệu, cách trạm buýt dưới 300m, quanh đó có cơm bình dân"* — trả lời được bằng đúng ba thao tác lọc.

**v10.3 — bản đồ tìm theo khu vực và bán kính**

Bản đồ được nâng cấp từ hình minh hoạ tĩnh thành công cụ tìm kiếm thật:

- Gõ tên khu vực hoặc tên trường, có gợi ý sẵn
- Lọc theo **bán kính** quanh điểm đã chọn
- Nền bản đồ đổi theo đúng tỉnh / thành đang xem
- Phóng to đáng kể (desktop 500→640px, mobile 190→320px) để đọc được nhãn ghim

Cùng đợt này, kho dữ liệu mở rộng từ **6 lên 32 phòng**, trải 5 tỉnh / thành có dữ liệu thật (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, Bình Dương) với 11 trường đại học. Mục đích: khi trình bày, sản phẩm phải trông như một nền tảng thật đang vận hành, không phải vài tin đăng mẫu.

---

### 3.3 — "Ở ghép cho rẻ, nhưng ghép nhầm người thì khổ cả năm"

**v10.2 — trắc nghiệm lối sống + điểm tương thích**

Đây là tính năng thuần tuý sinh vì nhu cầu sinh viên; các nền tảng cho thuê thông thường không có.

Sinh viên trả lời **5 câu hỏi** về lối sống:

| Câu hỏi | Hai lựa chọn |
|---|---|
| Giờ giấc ngủ | Ngủ sớm trước 22h30 / Ngủ muộn sau 0h để ôn bài |
| Giữ gìn vệ sinh | Rất gọn gàng, dọn hàng ngày / Dọn vài lần một tuần |
| Hút thuốc & thú cưng | Không / Có |
| Tần suất dẫn khách về | Hiếm khi / Thường xuyên |
| Ngân sách chia tiền phòng | Dưới 2.5tr / 2.5 – 3.5tr |

Hệ thống tính ra **% tương thích thật** với từng ứng viên trong danh sách, rồi xếp hạng lại. Điểm mấu chốt: con số phần trăm được **tính từ câu trả lời**, không phải số cố định gắn sẵn vào từng người — trả lời khác đi thì thứ hạng đổi theo.

---

### 3.4 — "Chuyển trọ một lần tốn bằng nửa tháng tiền phòng"

**v10.3 — đặt dịch vụ chuyển trọ**

Sinh viên chuyển trọ 1–2 lần mỗi năm và hầu như luôn bị hét giá vì không có cơ sở so sánh. Tính năng này cho:

- **So giá 4 đơn vị vận chuyển** cùng lúc, giá tính theo khoảng cách ước tính giữa hai điểm
- **Chat mô phỏng** với đơn vị đã chọn để hỏi thêm
- **Đánh giá dịch vụ** sau khi dùng, tạo thành vòng phản hồi giống phần rubric phòng trọ

Đặt ngay trong màn chi tiết phòng, đúng thời điểm sinh viên vừa quyết định thuê — không bắt họ đi tìm ở chỗ khác.

---

### 3.5 — "Đóng tiền đúng hạn cả năm mà chẳng ai ghi nhận" ⭐ *trọng tâm*

**v10.6 — ví tiền trọ, lịch sử thanh toán và điểm uy tín**

Đây là đợt cải tiến có giá trị thực tiễn cao nhất cho sinh viên, vì nó **biến việc đóng tiền đúng hạn thành một tài sản mang theo được**.

#### Phía sinh viên — màn hình "Ví Tiền Trọ & Điểm Uy Tín"

- Hợp đồng đang thuê: chủ trọ, giá, ngày đến hạn hàng tháng
- Kỳ thanh toán tháng này kèm nút đóng tiền
- **Lịch sử 12 tháng dạng heatmap** — mỗi ô một tháng, màu theo trạng thái: đúng hạn / trễ / còn nợ
- Bấm vào từng tháng xem chi tiết: đóng ngày nào, hạn ngày nào, trễ bao nhiêu ngày

#### Điểm uy tín thanh toán — công thức công khai

Bắt đầu từ **100 điểm**, sau đó:

| Yếu tố | Ảnh hưởng |
|---|---|
| Mỗi tháng đóng trễ | **−6 điểm** |
| Mỗi ngày trễ | **−0.8 điểm** |
| Mỗi tháng còn nợ chưa đóng | **−15 điểm** |
| Chuỗi tháng liên tiếp đúng hạn | **+1.5 điểm / tháng**, tối đa +8 |

Bốn mức xếp hạng: **Xuất Sắc** (≥ 90) · **Tốt** (≥ 75) · **Trung Bình** (≥ 60) · **Cần Cải Thiện** (< 60)

**Quyết định thiết kế quan trọng:** công thức được **hiển thị đầy đủ cho người dùng** trong một bảng "Cách tính điểm", không giấu. Lý do: cả dự án nói về *minh bạch* — nếu chính điểm uy tín lại là hộp đen thì tự mâu thuẫn. Sinh viên phải biết chính xác cần làm gì để cải thiện điểm của mình.

#### Điểm uy tín đi theo sinh viên sang phía chủ trọ

Khi sinh viên gửi yêu cầu hẹn xem phòng, **chủ trọ nhìn thấy ngay điểm uy tín** trên thẻ yêu cầu, trước khi quyết định duyệt.

Đây chính là chỗ tính năng trở nên có ý nghĩa hai chiều: sinh viên đóng tiền đàng hoàng có **bằng chứng** để thương lượng, thay vì phải tự nhận "em ở trọ đàng hoàng lắm". Chủ trọ bớt rủi ro nên bớt lý do đòi cọc cao.

> Kịch bản demo: Quốc Anh đạt **87/100 (Tốt)**; nếu đóng tiền đúng hạn ngay trong lúc demo, điểm tăng lên 88 — người xem thấy được cơ chế hoạt động chứ không chỉ thấy một con số tĩnh.

#### Phía chủ trọ — thu tiền và nhắc nhở

- **Heatmap tiền trọ 12 tháng** trên bảng điều khiển, mỗi ô một tháng theo tình trạng thu; bấm vào xem ai đã đóng, ai còn nợ
- Panel **"Giao dịch gần đây"**
- **Bảng nhắc nhở / cảnh báo** người thuê chưa đóng: soạn sẵn nội dung tin Zalo/SMS, kèm nút "✓ Đã Thu" cập nhật heatmap ngay

Kịch bản demo cố tình có đủ ba trạng thái để người xem hiểu ngay: 1 phòng đã đóng, 1 phòng quá hạn 8 ngày, 1 phòng sắp tới hạn.

---

### 3.6 — "Vào web mà không biết bắt đầu từ đâu"

**v10.5 — bảng hướng dẫn sử dụng**

Nút tròn **"?"** luôn hiện trên màn hình (cả desktop lẫn mobile), cũng mở được bằng phím tắt `?`. Bên trong là hướng dẫn chia 3 tab:

- **Sinh Viên** — 8 mục
- **Chủ Trọ** — 7 mục
- **Mẹo Chung** — 9 mục

Viết riêng cho từng vai trò vì hai nhóm người dùng có luồng công việc khác hẳn nhau. Toàn bộ nội dung nằm trong một nguồn dùng chung, nên bản desktop và mobile không thể lệch nhau.

*(Ba cải tiến còn lại của v10.5 — màn hình tải, logo và animation — là hình thức, không ghi ở đây.)*

---

### 3.7 — "Sinh viên quốc tế cũng cần tìm trọ"

**v10.7 — ba ngôn ngữ Việt / Anh / Trung**

Mở rộng đối tượng sử dụng sang sinh viên quốc tế đang học tại Việt Nam — nhóm gặp đúng năm nỗi đau ở Mục 1 nhưng còn thêm rào cản ngôn ngữ.

- Tiếng Việt là bản gốc; có thêm **tiếng Anh** và **tiếng Trung**
- **100%** chữ hiển thị đã được dịch, kể cả toàn bộ bảng hướng dẫn sử dụng
- Đổi ngôn ngữ áp dụng ngay, không cần tải lại trang

**Quyết định về nội dung:** tên riêng **cố ý giữ nguyên tiếng Việt** — tên người, tên phòng trọ, tên đường, tên trường, tên tỉnh / thành. Lý do: đó là tên thật của địa điểm; dịch ra sẽ khiến sinh viên quốc tế đọc địa chỉ xong không hỏi đường được. Cùng cách làm của Airbnb với tiêu đề tin đăng.

*(Phần tông màu sáng / tối của v10.7 là hình thức, không ghi ở đây.)*

---

### 3.8 — “Muốn hỏi một câu có nhiều điều kiện và nhìn bản đồ rộng hơn”

**v11.2 — chat tìm trọ offline và bản đồ kéo được trên hai chế độ**

- Chat tách biệt với bộ lọc trang chủ: đọc 32 phòng mẫu, nhận diện tỉnh/thành, Q.10, một số đường, tên trường, khoảng giá, tiện ích, ẩm thực, khoảng cách trạm buýt và bán kính tới trường; kết hợp các điều kiện bằng phép **và**. Báo tổng số phòng khớp, hiện tối đa 5 phòng, giải thích khi không khớp hoặc không hiểu câu hỏi.
- Chat chỉ là bộ phân tích quy tắc tiếng Việt, **không gọi AI/server thật**. Số tuyến xe buýt và tình trạng thực tế không được xác minh; khoảng cách tới trường được tính từ tọa độ trừu tượng, **không phải GPS**.
- Bản đồ tự vẽ các ô phố tiếp nối nhau khi kéo xa, không để lộ khoảng trống; panel bên cạnh và các ghim di chuyển cùng nền. Bản desktop rộng 70% khung, cao 680px; bản mobile cao 520px. Có thể kéo chuột hoặc vuốt một ngón trong bản đồ; thao tác ngoài bản đồ không bị chiếm để cuộn trang. Chạm ghim hoặc nút căn giữa vẫn hoạt động.
- **Kiểm chứng tự động (06/10/2026):** `node tests/v11.2.test.js` đạt (dữ liệu, parser đa điều kiện, tách bộ lọc trang chủ, đồng bộ cuộn, nền/ghim bản đồ). `node tests/v11.2.browser.js` chạy Edge thật đạt `BROWSER-SMOKE-OK` với 132 lượt vẽ, 10 câu chat desktop/mobile; kiểm tra zoom/căn giữa, wheel và vuốt ngoài map, ghim sau kéo/cuộn, touchcancel và tránh bấm nhầm sau kéo. Fixture Edge bỏ CDN/font mạng nên không thay cho đánh giá trực quan bố cục thực tế.

**Giới hạn:** dữ liệu phòng vẫn chỉ gồm 32 tin mẫu; ngoài vùng có ghim, bản đồ chỉ vẽ địa hình giả lập. Một số cách diễn đạt tự nhiên chưa được parser nhận diện.

---

## 4. Hiện trạng v11.2

**Phía sinh viên — 6 màn hình:**

1. Khám Phá & Lọc Nâng Cao
2. Chi Tiết, Rubric & Đánh Giá
3. Ghép Bạn Ở Cùng (Match)
4. Bản Đồ Tương Tác Trọng Điểm
5. Toàn Cảnh Quy Trình SV
6. Ví Tiền Trọ & Điểm Uy Tín

**Phía chủ trọ — 4 màn hình:**

1. Bảng Tổng Quan & Duyệt Lịch Hẹn
2. Quản Lý Phòng & Biểu Phí
3. Điểm Rubric & Góp Ý SV
4. Toàn Cảnh Đối Tác Chủ Trọ

**Quy mô dữ liệu:** 32 phòng · 5 tỉnh / thành có dữ liệu thật · 11 trường đại học · 4 đơn vị chuyển trọ · 3 ngôn ngữ

---

## 5. Nhu cầu người dùng chưa được đáp ứng

Liệt kê thẳng để người đọc không hiểu nhầm phạm vi hiện tại:

| Nhu cầu | Trạng thái | Vì sao quan trọng |
|---|---|---|
| **Upload minh chứng thuê phòng thật** để xác thực người đánh giá | Chưa làm — huy hiệu "đã xác minh" hiện chỉ là minh hoạ | Đây là mắt xích khiến rubric thật sự đáng tin thay vì chỉ là đánh giá ẩn danh |
| **Nhắn tin trực tiếp giữa hai sinh viên ghép phòng** | Chưa làm — mới có mẫu cam kết + AI chat chung | Ghép được rồi vẫn phải thoát ra ngoài app để liên lạc |
| Bản đồ dẫn đường / khoảng cách GPS chính xác | Chưa làm — bản đồ và tọa độ là mô phỏng offline | Tránh nhầm khoảng cách minh họa với tuyến đi thực tế |

Ngoài ra, toàn bộ dữ liệu là **mock trong bộ nhớ** và mất khi tải lại trang — đây là chủ đích của một bản prototype trình diễn, không phải thiếu sót.

---

## Phụ lục A — Đối chiếu với mã nguồn

Bảng dưới xác nhận từng tính năng thật sự xuất hiện ở đúng phiên bản được ghi trong tài liệu, bằng cách đếm dấu hiệu của nó trong mã nguồn mỗi bản (`0` = chưa có).

| Phiên bản | Số phòng | Lọc xe buýt | Lọc ẩm thực | Quiz ghép phòng | Chuyển trọ | Bán kính bản đồ | Ví tiền trọ | Điểm uy tín | Hướng dẫn | Đa ngôn ngữ |
|---|---|---|---|---|---|---|---|---|---|---|
| v10.1 | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| v10.2 | 6 | ✓ | ✓ | ✓ | 0 | 0 | 0 | 0 | 0 | 0 |
| v10.3 | **32** | ✓ | ✓ | ✓ | **✓** | **✓** | 0 | 0 | 0 | 0 |
| v10.5 | 32 | ✓ | ✓ | ✓ | ✓ | ✓ | 0 | 0 | **✓** | 0 |
| v10.6 | 32 | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** | **✓** | ✓ | 0 |
| v10.7 | 32 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✓** |
| v11.0 | 32 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Cách kiểm chứng lại (chạy trong thư mục dự án):

```bash
for f in v10.1 v10.2 v10.3 v10.5 v10.6 v10.7 v11.0; do
  F="uninest_canvas_studio_$f.html"
  echo "$f  phong=$(grep -o 'priceStr:' $F | wc -l)" \
       "buyt=$(grep -c 'busStopDistanceM' $F)" \
       "chuyentro=$(grep -c 'MOVING_BROKERS' $F)" \
       "tientro=$(grep -c 'getRentLedger' $F)" \
       "uytin=$(grep -c 'getTrustScore' $F)"
done
```

Các con số khác trong tài liệu (5 tiêu chí rubric, 5 câu hỏi quiz, 4 đơn vị chuyển trọ, 11 trường, công thức điểm uy tín, 4 mức xếp hạng) đều lấy trực tiếp từ các hằng số `ROOM_RUBRIC_CRITERIA`, `LIFESTYLE_QUESTIONS`, `MOVING_BROKERS`, `UNIVERSITIES_LIST`, `TRUST_RULES`, `TRUST_RANKS` trong `versions/uninest_canvas_studio_v11.0.html`.

---

## Phụ lục B — Những gì tài liệu này cố ý bỏ qua

Để người đọc biết mình đang *không* đọc gì, và tìm ở đâu nếu cần:

| Phiên bản | Nội dung | Vì sao không ghi |
|---|---|---|
| v10.4 | Rút gọn tiêu đề và badge phiên bản | Thuần hình thức |
| v10.5 *(một phần)* | Màn hình tải giả lập, logo, animation | Thuần hình thức |
| v10.7 *(một phần)* | Tông màu sáng / tối | Thuần hình thức |
| v10.8 | Chuyển nút đổi ngôn ngữ & tông màu vào trong giao diện | Đổi vị trí, không thêm khả năng |
| v10.9 | Dọn header, phóng to logo màn hình tải | Thuần hình thức |
| v11.0 | Sửa logo header, giãn dòng toàn bộ giao diện | Thuần hình thức |

Chi tiết đầy đủ của các đợt này — kèm lý do kỹ thuật và kết quả kiểm thử — nằm trong `CLAUDE.md`, mục *"Đã hoàn thành"*.
