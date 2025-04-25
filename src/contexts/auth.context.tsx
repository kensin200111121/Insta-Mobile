import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { StoreInfo } from '../interface/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import PinOverlay from '../screens/PinOverlay/PinOverlay';
import TokenChecker from '../components/CheckToken';

type AuthContextType = {
  storeToken: string,
  userToken: string,
  storeInfo: StoreInfo | undefined,
  hasOverlay: boolean,
  updateStoreToken: (_: string) => void,
  updateUserToken: (_: string) => void,
  updateStoreInfo: (_: StoreInfo | undefined) => void,
  openTokenOverlay: (title?: string) => void
};

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {

  const [isLoading, setIsLoading] = useState(true);
  const [hasOverlay, setHasOverlay] = useState(false);
  const [storeToken, setStoreToken] = useState('');
  const [userToken, setUserToken] = useState('');
  const [storeInfo, setStoreInfo] = useState<StoreInfo | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  
  const updateStoreToken = async (_token: string) => {
    try {
      await AsyncStorage.setItem('storeAuth', _token);
    } catch (e) {
      // saving error
    }
    setStoreToken(_token);
  }

  const openTokenOverlay = (title?: string) => {
    title && setTitle(title);
    setHasOverlay(true);
  }

  const updateUserToken = (_token: string) => {
    _token && setHasOverlay(false);
    setTitle('');
    setUserToken(_token);
  }

  const updateStoreInfo = (_setting: StoreInfo | undefined) => {
    setStoreInfo(_setting);
  }

  useEffect(() => {
    AsyncStorage
      .getItem('storeAuth')
      .then((_value) => {
        _value && setStoreToken(_value);
      })
      .catch(() => { })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    isLoading ?
      <View><Text>Initializing...</Text></View> :
      <AuthContext.Provider value={{ storeToken, userToken, storeInfo, hasOverlay, updateStoreToken, updateUserToken, updateStoreInfo, openTokenOverlay }}>
        {children}
        {
          hasOverlay ?
            <View style={styles.overlayContainer}>
              <PinOverlay title={title} />
            </View> :
            null
        }
        <TokenChecker />
      </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error();
  }

  return ctx;
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})