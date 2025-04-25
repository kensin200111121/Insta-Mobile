import React, { useEffect, useRef } from 'react';
import { CommonActions, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Startup from '../screens/Startup';
import Purchase from '../screens/Purchase';
import LoginScreen from '../screens/Login';
import { useAuthContext } from '../contexts/auth.context';
import VerifyPin from '../screens/VerifyPin';
import { navigationRef } from '../layout/NavMenu';

import Transaction from '../screens/Transaction';
import Refund from '../screens/Refund';
import Setting from '../screens/Setting';
import TestScreen from '../screens/Test/test';

const Stack = createStackNavigator();

const options = { headerShown: false, gestureEnabled: false };

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

function AppNavigator() {
  const { storeToken, userToken } = useAuthContext();
  const prevUserToken = useRef<string>('');

  useEffect(() => {
    if (prevUserToken.current && !userToken) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'verify' }],
        })
      );
    }
    prevUserToken.current = userToken;
  }, [userToken]);

  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ animation: 'none' }}>
        {
          !storeToken ? (
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={options}
            />
          ) : !userToken ? <Stack.Screen
            name="verify"
            component={VerifyPin}
            options={options}
          /> : (
            <>
              {/* <Stack.Screen
                name="test"
                component={TestScreen}
                options={options}
              /> */}
              <Stack.Screen
                name="startup"
                component={Startup}
                options={options}
              />
              <Stack.Screen
                name="purchase"
                component={Purchase}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
            </>
          )
        }
        <Stack.Screen
          name="transaction"
          component={Transaction}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="refund"
          component={Refund}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="setting"
          component={Setting}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

// import {createDrawerNavigator} from '@react-navigation/drawer';

// const Drawer = createDrawerNavigator();

// function DrawContent(props: any) {
//   return <SideMenu {...props} />;
// }

// function MainDrawer() {
//   return (
//     <Drawer.Navigator drawerContent={DrawContent}>
//       <Drawer.Screen name="MainTab" component={MainTab} options={options} />
//     </Drawer.Navigator>
//   );
// }

{/* <Stack.Screen
          name="MainDrawer"
          component={MainDrawer}
          options={options}
        /> */}