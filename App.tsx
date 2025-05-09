/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  NativeModules,
  StyleSheet,
  Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { configureFonts, MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';

import AppNavigator from './src/navigations/AppNavigator';
import { SvgXml } from 'react-native-svg';
import { bgImage } from './assets/svg/bg';
import { LayoutProvider, useLayoutContext } from './src/contexts/layout.context';
import { MenuProvider } from './src/contexts/menu.context';
import { AuthProvider } from './src/contexts/auth.context';
import NavMenu from './src/layout/NavMenu';
import SystemNavigationBar from 'react-native-system-navigation-bar';
const { DejavooPaymentModule } = NativeModules;

const fontConfig = {
  fontFamily: 'Inter'
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F7C41EBD', // contained mode button background color
    secondary: 'yellow',
    onSurface: 'white', // text color
    background: 'transparent', // input background color
  },
  fonts: configureFonts({ config: fontConfig }),
};

const App = () => {
  useEffect(() => {
    SystemNavigationBar.navigationHide().then(() => {
      console.log('hide the button');
    });
    DejavooPaymentModule.setupDejavoo();
  }, []);

  return (
    <>
      {/* <Text>Hello world</Text> */}
      <PaperProvider theme={theme}>
        <LayoutProvider>
          <AuthProvider>
            <SafeAreaProvider>
              <SafeAreaView style={styles.container}>
                <MenuProvider>
                  <Background />
                  <NavMenu />
                  <AppNavigator />
                </MenuProvider>
              </SafeAreaView>
            </SafeAreaProvider>
          </AuthProvider>
        </LayoutProvider>
      </PaperProvider>
    </>
  );
};

const Background = () => {
  const { width, height } = useLayoutContext();

  return (
    <SvgXml xml={bgImage(width, height - 60)} style={styles.bgImage} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImage: {
    position: 'absolute',
    top: 60,
    zIndex: 0,
  },
});

export default App;
