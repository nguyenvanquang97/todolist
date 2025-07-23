# Các bước thực hiện ứng dụng To-Do List với React Native và SQLite

## Lưu ý: Triển khai bằng TypeScript ✅

### Giai đoạn 1: Thiết lập môi trường và cài đặt dependencies

#### Bước 1: Cài đặt các thư viện cần thiết ✅
```bash
npm install react-native-sqlite-storage
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install react-native-elements react-native-vector-icons
npm install moment
npm install react-native-date-picker
npm install @notifee/react-native
```

### Bước 2: Cấu hình cho iOS (nếu cần) ✅
```bash
cd ios && pod install
```

### Bước 3: Cấu hình vector icons ✅
- Thêm fonts vào `android/app/build.gradle`
- Cấu hình Info.plist cho iOS

## Giai đoạn 2: Thiết lập cơ sở dữ liệu SQLite

### Bước 4: Tạo file database helper ✅
- Tạo file `src/database/DatabaseHelper.ts`
- Implement các functions:
  - `initDatabase()`: Khởi tạo database và tạo bảng ✅
  - `createTasksTable()`: Tạo bảng tasks ✅
  - `insertTask()`: Thêm task mới ✅
  - `getAllTasks()`: Lấy tất cả tasks ✅
  - `updateTask()`: Cập nhật task ✅
  - `deleteTask()`: Xóa task ✅
  - `searchTasks()`: Tìm kiếm tasks ✅
  - `filterTasks()`: Lọc tasks theo status/priority ✅
  - `getSettings()`: Lấy cài đặt ứng dụng ✅
  - `updateSettings()`: Cập nhật cài đặt ứng dụng ✅

### Bước 5: Tạo SQL schema ✅
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT,
  status TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT NOT NULL,
  notifications_enabled INTEGER NOT NULL,
  language TEXT NOT NULL,
  last_updated TEXT
);
```

## Giai đoạn 3: Thiết lập Navigation

### Bước 6: Cấu hình React Navigation ✅
- Tạo file `src/navigation/AppNavigator.tsx`
- Thiết lập Stack Navigator với các màn hình:
  - TaskListScreen (Màn hình chính) ✅
  - AddEditTaskScreen (Thêm/Sửa task) ✅
  - TaskDetailScreen (Chi tiết task) ✅
  - SettingsScreen (Cài đặt ứng dụng) ✅

## Giai đoạn 4: Xây dựng Components và Screens

### Bước 7: Tạo các components cơ bản ✅
- `src/components/TaskItem.tsx`: Component hiển thị một task trong list ✅
- `src/components/SearchBar.tsx`: Component tìm kiếm ✅
- `src/components/FilterModal.tsx`: Component modal lọc ✅
- `src/components/LoadingSpinner.tsx`: Component loading ✅
- `src/components/Button.tsx`: Component button tùy chỉnh ✅
- `src/components/ThemeToggle.tsx`: Component chuyển đổi chủ đề ✅
- `src/components/ThemeSelector.tsx`: Component chọn chủ đề ✅

### Bước 8: Xây dựng TaskListScreen ✅
- Tạo file `src/screens/TaskListScreen.tsx`
- Implement các tính năng:
  - Hiển thị danh sách tasks bằng FlatList ✅
  - Tìm kiếm tasks ✅
  - Lọc tasks theo status và priority ✅
  - Navigation đến màn hình thêm task ✅
  - Swipe to delete functionality ✅
  - Pull to refresh ✅

### Bước 9: Xây dựng AddEditTaskScreen ✅
- Tạo file `src/screens/AddEditTaskScreen.tsx`
- Implement form với các trường:
  - Title (TextInput) ✅
  - Description (TextInput multiline) ✅
  - Due Date (DatePicker) ✅
  - Priority (Picker/Select) ✅
  - Status (Picker/Select) ✅
- Validation form ✅
- Save/Update functionality ✅

### Bước 10: Xây dựng TaskDetailScreen ✅
- Tạo file `src/screens/TaskDetailScreen.tsx`
- Hiển thị chi tiết task ✅
- Buttons để Edit và Delete ✅
- Mark as completed functionality ✅

### Bước 11: Xây dựng SettingsScreen ✅
- Tạo file `src/screens/SettingsScreen.tsx`
- Implement các tùy chọn:
  - Chọn chủ đề (Light/Dark/System) ✅
  - Bật/tắt thông báo ✅
  - Chọn ngôn ngữ (Tiếng Anh/Tiếng Việt) ✅

## Giai đoạn 5: State Management và Context

### Bước 12: Tạo Context cho quản lý state ✅
- Tạo file `src/context/TaskContext.tsx` ✅
  - Implement TaskProvider với các actions:
    - loadTasks ✅
    - addTask ✅
    - updateTask ✅
    - deleteTask ✅
    - searchTasks ✅
    - filterTasks ✅
- Tạo file `src/context/ThemeContext.tsx` ✅
  - Implement ThemeProvider với các actions:
    - toggleTheme ✅
    - setTheme ✅
- Tạo file `src/context/SettingsContext.tsx` ✅
  - Implement SettingsProvider với các actions:
    - updateSettings ✅
    - loadSettings ✅

### Bước 13: Integrate Context vào App ✅
- Wrap App component với các Providers ✅
- Sử dụng useContext trong các screens ✅

## Giai đoạn 6: Styling và UI/UX

### Bước 14: Tạo theme và styles ✅
- Tạo file `src/styles/theme.ts`: Colors, fonts, spacing ✅
- Tạo file `src/styles/globalStyles.ts`: Common styles ✅
- Style cho từng component và screen ✅

### Bước 15: Implement responsive design ✅
- Sử dụng Dimensions API ✅
- Tối ưu cho cả iOS và Android ✅
- Test trên các kích thước màn hình khác nhau ✅

## Giai đoạn 7: Tính năng nâng cao

### Bước 16: Implement Local Notifications ✅
- Cài đặt `@notifee/react-native` ✅
- Tạo notification service ✅
  - `src/services/NotificationService.ts` ✅
  - `src/utils/notificationHelper.ts` ✅
- Schedule notifications cho due dates ✅
- Hủy notifications khi task hoàn thành hoặc bị xóa ✅

### Bước 17: Implement Internationalization (i18n) ✅
- Tạo file `src/i18n/i18n.ts` ✅
- Implement đa ngôn ngữ:
  - Tiếng Anh ✅
  - Tiếng Việt ✅
- Tích hợp với SettingsContext ✅

### Bước 18: Add animations và transitions
- Sử dụng Animated API
- Add smooth transitions giữa screens
- Implement swipe gestures

## Giai đoạn 8: Testing và Optimization

### Bước 19: Unit Testing
- Viết tests cho database functions
- Test các utility functions
- Test components với Jest và React Native Testing Library

### Bước 20: Performance Optimization ✅
- Optimize FlatList với getItemLayout ✅
- Implement lazy loading nếu cần ✅
- Optimize database queries ✅
- Memory leak prevention ✅
- Memoization cho components ✅

### Bước 21: Error Handling ✅
- Implement try-catch blocks ✅
- User-friendly error messages ✅
- Fallback UI cho error states ✅

## Giai đoạn 9: Build và Deploy

### Bước 22: Prepare for production
- Update app icons và splash screens
- Configure app permissions
- Update app.json/Info.plist

### Bước 23: Build APK/IPA
- Android: `cd android && ./gradlew assembleRelease`
- iOS: Build through Xcode

### Bước 24: Testing trên thiết bị thật
- Test trên các thiết bị Android và iOS khác nhau
- Performance testing
- User acceptance testing

## Checklist hoàn thành

- [x] Database setup và CRUD operations
- [x] Navigation giữa các screens
- [x] TaskListScreen với search và filter
- [x] AddEditTaskScreen với form validation
- [x] TaskDetailScreen với edit/delete
- [x] SettingsScreen với theme và language
- [x] State management với Context
- [x] Responsive UI design
- [x] TypeScript implementation
- [x] Utils functions (dateUtils, validation, constants)
- [x] Thông báo nhắc nhở (Notifications)
- [x] Đa ngôn ngữ (i18n)
- [x] Chủ đề sáng/tối (Theming)
- [x] Error handling
- [x] Performance optimization
- [ ] Animations và transitions
- [ ] Testing
- [ ] Production build

## Tính năng đã triển khai

### Core Features
- [x] Quản lý công việc (Thêm, Hiển thị, Xem chi tiết, Chỉnh sửa, Xóa)
- [x] Tìm kiếm và lọc công việc
- [x] Thông báo nhắc nhở
- [x] Tùy chỉnh giao diện (Chủ đề sáng/tối)
- [x] Đa ngôn ngữ (Tiếng Anh/Tiếng Việt)
- [x] Cài đặt ứng dụng

### Tính năng mở rộng (đề xuất)
- [ ] Quản lý danh mục và nhãn
- [ ] Quản lý dự án và công việc con
- [ ] Quản lý thời gian và lịch trình
- [ ] Tính năng cộng tác
- [ ] Gamification và động lực
- [x] Tính năng thông minh và tự động hóa (Công việc định kỳ)
- [ ] Backup và đồng bộ hóa

## Kế hoạch triển khai tính năng mở rộng

### Giai đoạn 1: Core Extensions (2-3 tháng)

#### Bước 1: Quản lý danh mục và nhãn (Categories & Tags)

##### 1.1. Cập nhật cơ sở dữ liệu
- Tạo bảng `categories`:
```sql
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  created_at TEXT NOT NULL
);
```
- Tạo bảng `tags`:
```sql
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0
);
```
- Tạo bảng `task_tags` (quan hệ nhiều-nhiều):
```sql
CREATE TABLE IF NOT EXISTS task_tags (
  task_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (task_id, tag_id),
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);
```
- Cập nhật bảng `tasks` với cột `category_id`:
```sql
ALTER TABLE tasks ADD COLUMN category_id INTEGER;
```

##### 1.2. Cập nhật DatabaseHelper
- Thêm các functions:
  - `createCategoriesTable()`: Tạo bảng categories
  - `createTagsTable()`: Tạo bảng tags
  - `createTaskTagsTable()`: Tạo bảng task_tags
  - `insertCategory()`: Thêm danh mục mới
  - `getAllCategories()`: Lấy tất cả danh mục
  - `updateCategory()`: Cập nhật danh mục
  - `deleteCategory()`: Xóa danh mục
  - `insertTag()`: Thêm nhãn mới
  - `getAllTags()`: Lấy tất cả nhãn
  - `getTagsForTask()`: Lấy nhãn cho task cụ thể
  - `addTagToTask()`: Thêm nhãn vào task
  - `removeTagFromTask()`: Xóa nhãn khỏi task
  - `updateTaskCategory()`: Cập nhật danh mục cho task

##### 1.3. Tạo Context mới
- Tạo file `src/context/CategoryContext.tsx`:
  - Implement CategoryProvider với các actions:
    - `loadCategories`: Lấy tất cả danh mục
    - `addCategory`: Thêm danh mục mới
    - `updateCategory`: Cập nhật danh mục
    - `deleteCategory`: Xóa danh mục
- Tạo file `src/context/TagContext.tsx`:
  - Implement TagProvider với các actions:
    - `loadTags`: Lấy tất cả nhãn
    - `addTag`: Thêm nhãn mới
    - `updateTag`: Cập nhật nhãn
    - `deleteTag`: Xóa nhãn
    - `getTagsForTask`: Lấy nhãn cho task
    - `addTagToTask`: Thêm nhãn vào task
    - `removeTagFromTask`: Xóa nhãn khỏi task

##### 1.4. Tạo Components mới
- `src/components/CategorySelector.tsx`: Component chọn danh mục
- `src/components/CategoryItem.tsx`: Component hiển thị danh mục
- `src/components/TagInput.tsx`: Component nhập và chọn nhãn
- `src/components/TagChip.tsx`: Component hiển thị nhãn

##### 1.5. Tạo Screens mới
- `src/screens/CategoryManagementScreen.tsx`: Quản lý danh mục
- Cập nhật `AddEditTaskScreen.tsx` để thêm chọn danh mục và nhãn
- Cập nhật `TaskDetailScreen.tsx` để hiển thị danh mục và nhãn
- Cập nhật `TaskListScreen.tsx` để lọc theo danh mục

#### Bước 2: Công việc con (Subtasks)

##### 2.1. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `tasks` với cột `parent_task_id` và `completion_percentage`:
```sql
ALTER TABLE tasks ADD COLUMN parent_task_id INTEGER;
ALTER TABLE tasks ADD COLUMN completion_percentage INTEGER DEFAULT 0;
```

##### 2.2. Cập nhật DatabaseHelper
- Thêm các functions:
  - `getSubtasks()`: Lấy công việc con của task
  - `updateTaskCompletion()`: Cập nhật phần trăm hoàn thành
  - `calculateParentCompletion()`: Tính phần trăm hoàn thành của task cha

##### 2.3. Cập nhật TaskContext
- Thêm các actions:
  - `addSubtask`: Thêm công việc con
  - `updateSubtask`: Cập nhật công việc con
  - `deleteSubtask`: Xóa công việc con
  - `getSubtasks`: Lấy danh sách công việc con

##### 2.4. Tạo Components mới
- `src/components/SubtaskList.tsx`: Danh sách công việc con
- `src/components/SubtaskItem.tsx`: Component hiển thị công việc con
- `src/components/ProgressBar.tsx`: Thanh tiến độ

##### 2.5. Cập nhật Screens
- Cập nhật `TaskDetailScreen.tsx` để hiển thị và quản lý công việc con
- Cập nhật `AddEditTaskScreen.tsx` để thêm/sửa công việc con

#### Bước 3: Pomodoro Timer cơ bản

##### 3.1. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `settings` với các cột mới:
```sql
ALTER TABLE settings ADD COLUMN pomodoro_work_time INTEGER DEFAULT 25;
ALTER TABLE settings ADD COLUMN pomodoro_break_time INTEGER DEFAULT 5;
```
- Tạo bảng `time_entries`:
```sql
CREATE TABLE IF NOT EXISTS time_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration INTEGER,
  type TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);
```

##### 3.2. Tạo Service mới
- `src/services/PomodoroService.ts`: Quản lý timer Pomodoro

##### 3.3. Tạo Context mới
- `src/context/PomodoroContext.tsx`: Quản lý state của Pomodoro

##### 3.4. Tạo Components mới
- `src/components/pomodoro/PomodoroTimer.tsx`: Bộ đếm thời gian
- `src/components/pomodoro/PomodoroControls.tsx`: Điều khiển timer
- `src/components/pomodoro/PomodoroStats.tsx`: Thống kê phiên làm việc

##### 3.5. Tạo Screen mới
- `src/screens/PomodoroScreen.tsx`: Màn hình Pomodoro
- Cập nhật `SettingsScreen.tsx` để thêm cài đặt Pomodoro

#### Bước 4: Thống kê đơn giản

##### 4.1. Cập nhật cơ sở dữ liệu
- Tạo bảng `user_stats`:
```sql
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_tasks_completed INTEGER DEFAULT 0,
  total_time_worked INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_updated TEXT
);
```

##### 4.2. Tạo Service mới
- `src/services/StatsService.ts`: Tính toán và cập nhật thống kê

##### 4.3. Tạo Context mới
- `src/context/StatsContext.tsx`: Quản lý state của thống kê

##### 4.4. Cài đặt thư viện
```bash
npm install react-native-chart-kit
npm install react-native-svg
```

##### 4.5. Tạo Components mới
- `src/components/charts/TaskCompletionChart.tsx`: Biểu đồ hoàn thành công việc
- `src/components/charts/TimeDistributionChart.tsx`: Biểu đồ phân bố thời gian
- `src/components/StatsCard.tsx`: Card hiển thị thống kê

##### 4.6. Tạo Screen mới
- `src/screens/StatsScreen.tsx`: Màn hình thống kê

### Giai đoạn 2: Advanced Features (3-4 tháng)

#### Bước 5: Quản lý dự án (Projects)

##### 5.1. Cập nhật cơ sở dữ liệu
- Tạo bảng `projects`:
```sql
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL,
  color TEXT,
  created_at TEXT NOT NULL
);
```
- Cập nhật bảng `tasks` với cột `project_id`:
```sql
ALTER TABLE tasks ADD COLUMN project_id INTEGER;
```

##### 5.2. Cập nhật DatabaseHelper
- Thêm các functions:
  - `createProjectsTable()`: Tạo bảng projects
  - `insertProject()`: Thêm dự án mới
  - `getAllProjects()`: Lấy tất cả dự án
  - `getProject()`: Lấy chi tiết dự án
  - `updateProject()`: Cập nhật dự án
  - `deleteProject()`: Xóa dự án
  - `getTasksByProject()`: Lấy công việc theo dự án
  - `updateTaskProject()`: Cập nhật dự án cho task

##### 5.3. Tạo Context mới
- `src/context/ProjectContext.tsx`: Quản lý state của dự án

##### 5.4. Tạo Components mới
- `src/components/ProjectSelector.tsx`: Component chọn dự án
- `src/components/ProjectItem.tsx`: Component hiển thị dự án
- `src/components/ProjectProgress.tsx`: Hiển thị tiến độ dự án

##### 5.5. Tạo Screens mới
- `src/screens/ProjectListScreen.tsx`: Danh sách dự án
- `src/screens/ProjectDetailScreen.tsx`: Chi tiết dự án
- `src/screens/AddEditProjectScreen.tsx`: Thêm/sửa dự án

#### Bước 6: Time Tracking chi tiết

##### 6.1. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `tasks` với các cột mới:
```sql
ALTER TABLE tasks ADD COLUMN estimated_time INTEGER;
ALTER TABLE tasks ADD COLUMN actual_time INTEGER DEFAULT 0;
```

##### 6.2. Tạo Service mới
- `src/services/TimeTrackingService.ts`: Quản lý theo dõi thời gian

##### 6.3. Tạo Context mới
- `src/context/TimeTrackingContext.tsx`: Quản lý state của time tracking

##### 6.4. Tạo Components mới
- `src/components/TimeTracker.tsx`: Component theo dõi thời gian
- `src/components/TimeEntryList.tsx`: Danh sách các phiên làm việc
- `src/components/TimeEstimator.tsx`: Component ước tính thời gian

##### 6.5. Cập nhật Screens
- Cập nhật `TaskDetailScreen.tsx` để thêm tính năng time tracking
- Cập nhật `AddEditTaskScreen.tsx` để thêm ước tính thời gian
- Tạo `src/screens/TimeReportScreen.tsx`: Báo cáo thời gian

#### Bước 7: Gamification cơ bản

##### 7.1. Cập nhật cơ sở dữ liệu
- Tạo bảng `achievements`:
```sql
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER NOT NULL,
  unlocked_at TEXT
);
```
- Cập nhật bảng `user_stats` với cột mới:
```sql
ALTER TABLE user_stats ADD COLUMN total_points INTEGER DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN level INTEGER DEFAULT 1;
```

##### 7.2. Tạo Service mới
- `src/services/GamificationService.ts`: Quản lý điểm và thành tích

##### 7.3. Tạo Context mới
- `src/context/GamificationContext.tsx`: Quản lý state của gamification

##### 7.4. Tạo Components mới
- `src/components/gamification/AchievementBadge.tsx`: Huy hiệu thành tích
- `src/components/gamification/PointsDisplay.tsx`: Hiển thị điểm
- `src/components/gamification/LevelProgress.tsx`: Tiến độ cấp độ
- `src/components/gamification/StreakCounter.tsx`: Đếm chuỗi ngày

##### 7.5. Tạo Screen mới
- `src/screens/AchievementScreen.tsx`: Màn hình thành tích

#### Bước 8: Templates

##### 8.1. Cập nhật cơ sở dữ liệu
- Tạo bảng `templates`:
```sql
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  template_data TEXT NOT NULL,
  category TEXT,
  is_public INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

##### 8.2. Cập nhật DatabaseHelper
- Thêm các functions:
  - `createTemplatesTable()`: Tạo bảng templates
  - `insertTemplate()`: Thêm mẫu mới
  - `getAllTemplates()`: Lấy tất cả mẫu
  - `getTemplate()`: Lấy chi tiết mẫu
  - `updateTemplate()`: Cập nhật mẫu
  - `deleteTemplate()`: Xóa mẫu
  - `createTaskFromTemplate()`: Tạo task từ mẫu

##### 8.3. Tạo Context mới
- `src/context/TemplateContext.tsx`: Quản lý state của templates

##### 8.4. Tạo Components mới
- `src/components/TemplateSelector.tsx`: Component chọn mẫu
- `src/components/TemplateItem.tsx`: Component hiển thị mẫu

##### 8.5. Tạo Screens mới
- `src/screens/TemplateScreen.tsx`: Quản lý mẫu
- `src/screens/AddEditTemplateScreen.tsx`: Thêm/sửa mẫu

### Giai đoạn 3: Smart Features (4-5 tháng)

#### Bước 9: Công việc định kỳ (Recurring Tasks) 

##### 9.1. Cập nhật cơ sở dữ liệu 
- Cập nhật bảng `tasks` với các cột mới:
```sql
ALTER TABLE tasks ADD COLUMN recurring_type TEXT;
ALTER TABLE tasks ADD COLUMN recurring_interval INTEGER;
```

##### 9.2. Tạo Service mới 
- `src/services/RecurringTaskService.ts`: Quản lý công việc định kỳ

##### 9.3. Cập nhật TaskContext 
- Thêm các actions:
  - `createRecurringTask`: Tạo công việc định kỳ
  - `updateRecurringTask`: Cập nhật công việc định kỳ
  - `completeRecurringTask`: Hoàn thành và tạo công việc tiếp theo

##### 9.4. Tạo Components mới
- `src/components/RecurrenceSelector.tsx`: Chọn loại lặp lại
- `src/components/RecurrenceInfo.tsx`: Hiển thị thông tin lặp lại

##### 9.5. Cập nhật Screens
- Cập nhật `AddEditTaskScreen.tsx` để thêm tùy chọn lặp lại
- Cập nhật `TaskDetailScreen.tsx` để hiển thị thông tin lặp lại

#### Bước 10: Voice Commands

##### 10.1. Cài đặt thư viện
```bash
npm install react-native-voice
npm install react-native-tts
```

##### 10.2. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `settings` với cột mới:
```sql
ALTER TABLE settings ADD COLUMN voice_commands_enabled INTEGER DEFAULT 0;
```

##### 10.3. Tạo Service mới
- `src/services/voice/VoiceRecognitionService.ts`: Nhận diện giọng nói
- `src/services/voice/TextToSpeechService.ts`: Chuyển văn bản thành giọng nói
- `src/services/voice/VoiceCommandParser.ts`: Xử lý lệnh giọng nói

##### 10.4. Tạo Context mới
- `src/context/VoiceContext.tsx`: Quản lý state của voice commands

##### 10.5. Tạo Components mới
- `src/components/VoiceInput.tsx`: Component nhập liệu bằng giọng nói
- `src/components/VoiceCommandButton.tsx`: Nút kích hoạt lệnh giọng nói

##### 10.6. Tạo Screen mới
- `src/screens/VoiceCommandScreen.tsx`: Cài đặt lệnh giọng nói

#### Bước 11: Location-based Reminders

##### 11.1. Cài đặt thư viện
```bash
npm install react-native-geolocation-service
npm install react-native-maps
```

##### 11.2. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `tasks` với các cột mới:
```sql
ALTER TABLE tasks ADD COLUMN location_lat REAL;
ALTER TABLE tasks ADD COLUMN location_lng REAL;
ALTER TABLE tasks ADD COLUMN location_name TEXT;
```
- Cập nhật bảng `settings` với cột mới:
```sql
ALTER TABLE settings ADD COLUMN location_reminders_enabled INTEGER DEFAULT 0;
```

##### 11.3. Tạo Service mới
- `src/services/location/LocationService.ts`: Quản lý vị trí
- `src/services/location/GeofencingService.ts`: Quản lý geofencing

##### 11.4. Cập nhật NotificationService
- Thêm hỗ trợ thông báo dựa trên vị trí

##### 11.5. Tạo Components mới
- `src/components/LocationPicker.tsx`: Chọn vị trí
- `src/components/LocationInfo.tsx`: Hiển thị thông tin vị trí

##### 11.6. Cập nhật Screens
- Cập nhật `AddEditTaskScreen.tsx` để thêm chọn vị trí
- Cập nhật `TaskDetailScreen.tsx` để hiển thị thông tin vị trí
- Cập nhật `SettingsScreen.tsx` để thêm cài đặt nhắc nhở theo vị trí

#### Bước 12: Advanced Analytics

##### 12.1. Cài đặt thư viện
```bash
npm install react-native-calendar-heatmap
npm install react-native-chart-kit
```

##### 12.2. Tạo Service mới
- `src/services/AnalyticsService.ts`: Phân tích dữ liệu

##### 12.3. Tạo Components mới
- `src/components/charts/ProductivityHeatmap.tsx`: Bản đồ nhiệt năng suất
- `src/components/charts/CategoryDistribution.tsx`: Phân bố theo danh mục
- `src/components/charts/CompletionTrend.tsx`: Xu hướng hoàn thành
- `src/components/charts/TimeDistribution.tsx`: Phân bố thời gian

##### 12.4. Tạo Screen mới
- `src/screens/AnalyticsScreen.tsx`: Màn hình phân tích

### Giai đoạn 4: Cloud & Collaboration (3-4 tháng)

#### Bước 13: Cloud Backup

##### 13.1. Cài đặt thư viện
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/storage
```

##### 13.2. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `settings` với các cột mới:
```sql
ALTER TABLE settings ADD COLUMN auto_backup_enabled INTEGER DEFAULT 0;
ALTER TABLE settings ADD COLUMN last_backup_time TEXT;
ALTER TABLE settings ADD COLUMN backup_frequency TEXT DEFAULT 'weekly';
```

##### 13.3. Tạo Service mới
- `src/services/backup/BackupService.ts`: Quản lý backup
- `src/services/backup/FirebaseService.ts`: Tương tác với Firebase
- `src/services/backup/SyncService.ts`: Đồng bộ hóa dữ liệu

##### 13.4. Tạo Context mới
- `src/context/BackupContext.tsx`: Quản lý state của backup

##### 13.5. Tạo Components mới
- `src/components/backup/BackupStatus.tsx`: Trạng thái backup
- `src/components/backup/RestoreOptions.tsx`: Tùy chọn khôi phục

##### 13.6. Tạo Screen mới
- `src/screens/BackupScreen.tsx`: Quản lý backup và khôi phục
- `src/screens/AuthScreen.tsx`: Đăng nhập/đăng ký

#### Bước 14: Import/Export

##### 14.1. Cài đặt thư viện
```bash
npm install react-native-fs
npm install react-native-share
npm install react-native-document-picker
```

##### 14.2. Tạo Service mới
- `src/services/ImportExportService.ts`: Quản lý import/export

##### 14.3. Tạo Components mới
- `src/components/ExportOptions.tsx`: Tùy chọn xuất dữ liệu
- `src/components/ImportOptions.tsx`: Tùy chọn nhập dữ liệu

##### 14.4. Cập nhật Screens
- Cập nhật `BackupScreen.tsx` để thêm tùy chọn import/export

#### Bước 15: Widget

##### 15.1. Cài đặt thư viện
```bash
npm install react-native-widget-extension
```

##### 15.2. Tạo Widget Components
- `src/widgets/TaskListWidget.tsx`: Widget danh sách công việc
- `src/widgets/TodayTaskWidget.tsx`: Widget công việc hôm nay
- `src/widgets/StatsWidget.tsx`: Widget thống kê

##### 15.3. Cấu hình Widget cho iOS và Android
- Cấu hình `ios/WidgetExtension/`
- Cấu hình `android/app/src/main/java/com/yourapp/widgets/`

#### Bước 16: Focus Mode

##### 16.1. Cập nhật cơ sở dữ liệu
- Cập nhật bảng `settings` với cột mới:
```sql
ALTER TABLE settings ADD COLUMN focus_mode_enabled INTEGER DEFAULT 0;
ALTER TABLE settings ADD COLUMN focus_mode_duration INTEGER DEFAULT 60;
```

##### 16.2. Cài đặt thư viện
```bash
npm install react-native-background-timer
npm install react-native-sound
```

##### 16.3. Tạo Service mới
- `src/services/FocusModeService.ts`: Quản lý chế độ tập trung

##### 16.4. Tạo Context mới
- `src/context/FocusContext.tsx`: Quản lý state của focus mode

##### 16.5. Tạo Components mới
- `src/components/focus/FocusTimer.tsx`: Bộ đếm thời gian tập trung
- `src/components/focus/FocusSettings.tsx`: Cài đặt chế độ tập trung
- `src/components/focus/WhiteNoisePlayer.tsx`: Phát âm thanh white noise

##### 16.6. Tạo Screen mới
- `src/screens/FocusModeScreen.tsx`: Màn hình chế độ tập trung

### Giai đoạn 5: Premium Features (2-3 tháng)

#### Bước 17: Advanced AI Suggestions

##### 17.1. Cài đặt thư viện
```bash
npm install @tensorflow/tfjs
npm install @tensorflow/tfjs-react-native
```

##### 17.2. Tạo Service mới
- `src/services/ai/SuggestionService.ts`: Dịch vụ gợi ý thông minh
- `src/services/ai/TaskClassifier.ts`: Phân loại công việc tự động
- `src/services/ai/PriorityPredictor.ts`: Dự đoán mức độ ưu tiên

##### 17.3. Tạo Components mới
- `src/components/ai/SmartSuggestions.tsx`: Hiển thị gợi ý thông minh
- `src/components/ai/AutoCategorizer.tsx`: Tự động phân loại

#### Bước 18: Team Collaboration

##### 18.1. Cài đặt thư viện
```bash
npm install @react-native-firebase/firestore
```

##### 18.2. Tạo Service mới
- `src/services/collaboration/TeamService.ts`: Quản lý nhóm
- `src/services/collaboration/SharingService.ts`: Chia sẻ công việc

##### 18.3. Tạo Screens mới
- `src/screens/TeamScreen.tsx`: Quản lý nhóm
- `src/screens/SharedTasksScreen.tsx`: Công việc được chia sẻ

#### Bước 19: Advanced Reporting

##### 19.1. Cài đặt thư viện
```bash
npm install react-native-pdf
npm install react-native-html-to-pdf
```

##### 19.2. Tạo Service mới
- `src/services/ReportingService.ts`: Tạo báo cáo

##### 19.3. Tạo Screen mới
- `src/screens/ReportScreen.tsx`: Tạo và xem báo cáo

#### Bước 20: Premium Themes

##### 20.1. Mở rộng Theme System
- Tạo các theme premium với nhiều tùy chỉnh hơn
- Hỗ trợ tùy chỉnh màu sắc
- Hỗ trợ font chữ tùy chỉnh

##### 20.2. Tạo Components mới
- `src/components/ThemeCustomizer.tsx`: Tùy chỉnh theme

##### 20.3. Cập nhật Screens
- Cập nhật `SettingsScreen.tsx` để thêm tùy chọn theme premium

## Thời gian ước tính cho tính năng mở rộng

- **Giai đoạn 1: Core Extensions**: 2-3 tháng
  - Quản lý danh mục và nhãn: 2-3 tuần
  - Công việc con: 2-3 tuần
  - Pomodoro Timer cơ bản: 1-2 tuần
  - Thống kê đơn giản: 1-2 tuần

- **Giai đoạn 2: Advanced Features**: 3-4 tháng
  - Quản lý dự án: 3-4 tuần
  - Time tracking chi tiết: 2-3 tuần
  - Gamification cơ bản: 2-3 tuần
  - Templates: 2-3 tuần

- **Giai đoạn 3: Smart Features**: 4-5 tháng
  - Công việc định kỳ: 3-4 tuần
  - Voice Commands: 3-4 tuần
  - Location-based Reminders: 3-4 tuần
  - Advanced Analytics: 3-4 tuần

- **Giai đoạn 4: Cloud & Collaboration**: 3-4 tháng
  - Cloud Backup: 3-4 tuần
  - Import/Export: 2-3 tuần
  - Widget: 2-3 tuần
  - Focus Mode: 2-3 tuần

- **Giai đoạn 5: Premium Features**: 2-3 tháng
  - Advanced AI Suggestions: 3-4 tuần
  - Team Collaboration: 2-3 tuần
  - Advanced Reporting: 1-2 tuần
  - Premium Themes: 1-2 tuần

**Tổng thời gian**: 14-19 tháng (nếu triển khai tuần tự)

## Tài liệu tham khảo bổ sung

- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [React Native Voice](https://github.com/react-native-voice/voice)
- [React Native Firebase](https://rnfirebase.io/)
- [React Native Calendars](https://github.com/wix/react-native-calendars)
- [TensorFlow.js for React Native](https://www.tensorflow.org/js/tutorials/conversion/import_keras)
- [React Native Geolocation](https://github.com/react-native-geolocation/react-native-geolocation)
- [React Native Background Timer](https://github.com/ocetnik/react-native-background-timer)

## Thời gian ước tính

- **Giai đoạn 1-2**: 1-2 ngày
- **Giai đoạn 3-4**: 3-4 ngày
- **Giai đoạn 5-6**: 2-3 ngày
- **Giai đoạn 7**: 2-3 ngày
- **Giai đoạn 8-9**: 2-3 ngày

**Tổng thời gian**: 10-15 ngày làm việc

## Tài liệu tham khảo

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native SQLite Storage](https://github.com/andpor/react-native-sqlite-storage)
- [React Native Elements](https://reactnativeelements.com/docs/)
- [Notifee Documentation](https://notifee.app/react-native/docs/overview)
- [i18next](https://www.i18next.com/)