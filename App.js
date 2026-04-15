
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen        from './src/screens/LoginScreen';
import RegisterScreen     from './src/screens/RegisterScreen';
import HomeScreen         from './src/screens/HomeScreen';
import DashboardScreen    from './src/screens/DashboardScreen';
import StoreDetailScreen  from './src/screens/StoreDetailScreen';
import AddEditStoreScreen from './src/screens/AddEditStoreScreen';

const Stack = createNativeStackNavigator();

// ── App shell — switches between Auth and Main stacks ─────────────────────────
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6fa' }}>
        <ActivityIndicator size="large" color="#E62B4A" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Home' : 'Login'}>
      {!user ? (
        // ── Unauthenticated stack ──────────────────────────────────────────────
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // ── Authenticated stack ────────────────────────────────────────────────
        <>
          <Stack.Screen name="Home"         component={HomeScreen} />
          <Stack.Screen name="Dashboard"    component={DashboardScreen} />
          <Stack.Screen name="StoreDetail"  component={StoreDetailScreen} />
          <Stack.Screen name="AddEditStore" component={AddEditStoreScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
