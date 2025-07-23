import React, { memo } from 'react';
import TaskItem, { TaskItemProps } from './TaskItem';

// Memo hóa TaskItem để tránh render lại không cần thiết
// Chỉ render lại khi props thay đổi
const MemoizedTaskItem = memo(
  (props: TaskItemProps) => <TaskItem {...props} />,
  (prevProps, nextProps) => {
    // Chỉ render lại khi có sự thay đổi thực sự
    // So sánh các props quan trọng
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.title === nextProps.task.title &&
      prevProps.task.description === nextProps.task.description &&
      prevProps.task.status === nextProps.task.status &&
      prevProps.task.priority === nextProps.task.priority &&
      prevProps.task.due_date === nextProps.task.due_date &&
      prevProps.task.category_id === nextProps.task.category_id
    );
  }
);

export default MemoizedTaskItem;
