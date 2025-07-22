# Hướng dẫn tạo biểu tượng ứng dụng iOS

File `app_logo.svg` là file vector của biểu tượng ứng dụng. Để tạo các kích thước biểu tượng khác nhau cho iOS, bạn cần:

1. Mở file SVG trong một trình chỉnh sửa đồ họa như Adobe Illustrator, Sketch, Figma hoặc Inkscape.
2. Xuất file thành các kích thước PNG sau:

| Kích thước | Scale | Tên file gợi ý |
|------------|-------|----------------|
| 20x20      | @2x   | AppIcon-20@2x.png |
| 20x20      | @3x   | AppIcon-20@3x.png |
| 29x29      | @2x   | AppIcon-29@2x.png |
| 29x29      | @3x   | AppIcon-29@3x.png |
| 40x40      | @2x   | AppIcon-40@2x.png |
| 40x40      | @3x   | AppIcon-40@3x.png |
| 60x60      | @2x   | AppIcon-60@2x.png |
| 60x60      | @3x   | AppIcon-60@3x.png |
| 1024x1024  | @1x   | AppIcon-1024.png |

3. Sau khi tạo các file PNG, cập nhật file `Contents.json` để tham chiếu đến các file này.
4. Hoặc đơn giản hơn, bạn có thể mở dự án trong Xcode và kéo các file PNG vào Assets Catalog.

Lưu ý: Bạn cũng có thể sử dụng các công cụ trực tuyến để tạo biểu tượng iOS từ một hình ảnh duy nhất.