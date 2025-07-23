import { createRef } from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from './RootStackNavigator';

// Tạo một reference đến NavigationContainer
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

// Hàm điều hướng đến một màn hình
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.current) {
    // Sửa lỗi TypeScript bằng cách truyền tham số đúng định dạng
    navigationRef.current.navigate({
      name: name,
      params: params,
    });
  } else {
    console.error('Navigation reference is not set');
  }
}

// Hàm điều hướng và thay thế màn hình hiện tại
export function replace<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.current) {
    // Sửa lỗi TypeScript bằng cách truyền tham số đúng định dạng
    navigationRef.current.dispatch(
      StackActions.replace({
        name: name,
        params: params,
      })
    );
  } else {
    console.error('Navigation reference is not set');
  }
}

// Hàm quay lại màn hình trước đó
export function goBack() {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  } else {
    console.error('Navigation reference is not set');
  }
}

// Hàm reset stack navigation
export function reset(routes: { name: keyof RootStackParamList; params?: any }[]) {
  if (navigationRef.current) {
    // Đảm bảo định dạng đúng cho routes
    const formattedRoutes = routes.map(route => ({
      name: route.name,
      params: route.params,
    }));
    
    navigationRef.current.reset({
      index: formattedRoutes.length - 1,
      routes: formattedRoutes,
    });
  } else {
    console.error('Navigation reference is not set');
  }
}

// Hàm lấy route hiện tại
export function getCurrentRoute() {
  if (navigationRef.current) {
    return navigationRef.current.getCurrentRoute();
  }
  return null;
}

// Export tất cả các hàm navigation trong một đối tượng
const NavigationService = {
  navigate,
  replace,
  goBack,
  reset,
  getCurrentRoute,
};

export default NavigationService;