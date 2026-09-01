import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer
} from '@react-navigation/native';
import type { Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Boxes, Tags, Users } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { CategoryFormScreen } from '../screens/CategoryFormScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { ProductFormScreen } from '../screens/ProductFormScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { StockMovementScreen } from '../screens/StockMovementScreen';
import { UserFormScreen } from '../screens/UserFormScreen';
import { UsersScreen } from '../screens/UsersScreen';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function LoadingState() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.loading}>
      <ActivityIndicator color={theme.primary} size="large" />
      <Text style={styles.loadingText}>Carregando sessao</Text>
    </View>
  );
}

function MainTabs() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.tabBar
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800'
        },
        tabBarIcon: ({ color, focused }) => {
          const size = focused ? 24 : 22;

          if (route.name === 'CategoriesTab') {
            return <Tags size={size} color={color} />;
          }

          if (route.name === 'UsersTab') {
            return <Users size={size} color={color} />;
          }

          return <Boxes size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsScreen}
        options={{ title: 'Produtos' }}
      />
      {user?.role === 'ADMIN' ? (
        <>
          <Tab.Screen
            name="CategoriesTab"
            component={CategoriesScreen}
            options={{ title: 'Categorias' }}
          />
          <Tab.Screen
            name="UsersTab"
            component={UsersScreen}
            options={{ title: 'Usuarios' }}
          />
        </>
      ) : null}
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading } = useAuth();
  const { isDark, theme } = useTheme();

  const navigationTheme = useMemo<NavigationTheme>(() => {
    const baseTheme = isDark ? NavigationDarkTheme : NavigationDefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.surface,
        text: theme.text,
        border: theme.border,
        notification: theme.accent
      }
    };
  }, [isDark, theme]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background }
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />
            <Stack.Screen name="StockMovement" component={StockMovementScreen} />
            <Stack.Screen name="UserForm" component={UserFormScreen} />
            <Stack.Screen name="CategoryForm" component={CategoryFormScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      backgroundColor: theme.background
    },
    loadingText: {
      color: theme.muted,
      fontSize: 15,
      fontWeight: '700'
    }
  });
}
