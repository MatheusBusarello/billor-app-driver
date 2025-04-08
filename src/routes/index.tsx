import React, { forwardRef } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { StackRoutes } from './stack.routes';

type RoutesProps = {
  isAuthenticated: boolean;
};

export const Routes = forwardRef<any, RoutesProps>(({ isAuthenticated }, ref) => {
  const theme = DefaultTheme;

  return (
    <NavigationContainer theme={theme} ref={ref}>
      {isAuthenticated ? <StackRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
});
