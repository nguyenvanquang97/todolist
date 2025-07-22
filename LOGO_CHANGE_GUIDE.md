# Hướng dẫn thay đổi tên và logo ứng dụng

## Những thay đổi đã thực hiện

1. **Thay đổi tên ứng dụng**:
   - Đã cập nhật tên hiển thị từ "AwesomeProject" thành "AQuang công việc" trong:
     - `app.json` (React Native)
     - `strings.xml` (Android)
     - `Info.plist` (iOS)

2. **Thay đổi logo Android**:
   - Đã tạo file vector `app_logo.xml` trong thư mục `android/app/src/main/res/drawable/`
   - Đã tạo adaptive icon cho Android trong thư mục `mipmap-anydpi-v26`
   - Đã thêm màu nền cho biểu tượng trong `ic_launcher_background.xml`

3. **Thay đổi logo iOS**:
   - Đã tạo file vector `app_logo.svg` trong thư mục `ios/AwesomeProject/Images.xcassets/AppIcon.appiconset/`
   - Đã thêm hướng dẫn để tạo các kích thước biểu tượng khác nhau

## Các bước tiếp theo

### Android

Logo mới đã được cấu hình thông qua adaptive icon. Khi bạn build ứng dụng, logo mới sẽ được sử dụng.

### iOS

Để hoàn tất việc thay đổi logo cho iOS, bạn cần:

1. Mở dự án trong Xcode
2. Sử dụng file `app_logo.svg` để tạo các kích thước biểu tượng khác nhau theo hướng dẫn trong file README.md
3. Thêm các file PNG vào Assets Catalog

Hoặc bạn có thể sử dụng các công cụ trực tuyến để tạo biểu tượng iOS từ file SVG.

## Kiểm tra

Sau khi thực hiện các thay đổi, hãy build và chạy ứng dụng trên cả Android và iOS để đảm bảo tên và logo mới hiển thị chính xác.