# Hướng dẫn CI/CD cho Dự án TodoList

## Giới thiệu

Dự án này đã được cấu hình với GitHub Actions để tự động hóa quy trình build và kiểm thử. Các workflow sau đây đã được thiết lập:

1. **Android Build**: Tự động build APK cho Android
2. **iOS Build**: Tự động build IPA cho iOS

## Cấu hình Android Build

Workflow Android Build sẽ được kích hoạt khi:
- Push code lên nhánh `main` hoặc `master`
- Tạo Pull Request vào nhánh `main` hoặc `master`
- Kích hoạt thủ công thông qua GitHub Actions UI

Quy trình build bao gồm:
1. Checkout code từ repository
2. Cài đặt Node.js và dependencies
3. Cài đặt JDK và cấu hình Gradle
4. Build APK phiên bản release
5. Upload APK như một artifact của workflow

## Cấu hình iOS Build

Workflow iOS Build sẽ được kích hoạt khi:
- Push code lên nhánh `main` hoặc `master`
- Tạo Pull Request vào nhánh `main` hoặc `master`
- Kích hoạt thủ công thông qua GitHub Actions UI

Quy trình build bao gồm:
1. Checkout code từ repository
2. Cài đặt Node.js và dependencies
3. Cài đặt CocoaPods
4. Build ứng dụng iOS sử dụng Xcode
5. Upload IPA như một artifact của workflow

## Cấu hình iOS Signing

Để build iOS thành công, bạn cần cập nhật file `ios/ExportOptions.plist` với thông tin sau:

- `teamID`: ID của team Apple Developer của bạn
- `provisioningProfiles`: Cập nhật bundle ID và tên provisioning profile

## Sử dụng CI/CD

### Kích hoạt thủ công

1. Truy cập tab "Actions" trong GitHub repository
2. Chọn workflow "Android Build" hoặc "iOS Build"
3. Nhấp vào "Run workflow"
4. Chọn nhánh và nhấp "Run workflow"

### Tải xuống Artifacts

1. Sau khi workflow hoàn thành, truy cập vào chi tiết của workflow run
2. Cuộn xuống phần "Artifacts"
3. Tải xuống file APK hoặc IPA

## Tùy chỉnh Workflow

Bạn có thể tùy chỉnh các workflow bằng cách chỉnh sửa các file sau:

- `.github/workflows/android-build.yml`: Cấu hình build Android
- `.github/workflows/ios-build.yml`: Cấu hình build iOS

## Lưu ý

- Đảm bảo rằng bạn đã cấu hình đúng signing cho iOS trong file ExportOptions.plist
- Đối với build production, bạn nên cấu hình signing key cho Android
- Các secret như signing key, certificate nên được lưu trữ an toàn trong GitHub Secrets

## Xử lý Xung đột Phụ thuộc

- Các workflow đã được cấu hình để sử dụng flag `--legacy-peer-deps` với npm để giải quyết xung đột phụ thuộc giữa các package
- Điều này đặc biệt cần thiết do xung đột giữa `@react-native-community/datetimepicker@8.0.0` (yêu cầu react-native ^0.73.0) và phiên bản react-native hiện tại (0.79.1)
- Nếu bạn cập nhật các phụ thuộc, hãy kiểm tra lại các xung đột và điều chỉnh các workflow nếu cần