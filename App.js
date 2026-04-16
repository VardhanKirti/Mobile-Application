
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import GoogleAuthScreen   from './src/screens/GoogleAuthScreen';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Home' : 'GoogleAuth'}>
      {!user ? (
        // ── Unauthenticated stack ──────────────────────────────────────────────
        <>
          <Stack.Screen name="GoogleAuth" component={GoogleAuthScreen} />
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
