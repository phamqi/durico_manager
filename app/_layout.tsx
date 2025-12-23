import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DuricoAlertProvider, StateProvider } from '../context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <PaperProvider>
          <DuricoAlertProvider>
          <StateProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false, }} />
              </Stack>
              <Toast/>
            <StatusBar style="auto" />
          </StateProvider>
          </DuricoAlertProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
