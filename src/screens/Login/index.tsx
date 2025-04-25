import React, { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useLayoutContext } from '../../contexts/layout.context';
import Header from '../../layout/header';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signIn } from '../../api/auth.api';
import { useAuthContext } from '../../contexts/auth.context';

const logoImage = require('../../../assets/icons/logo.png');

const LoginScreen = () => {
  const styles = useStyles();
  const { isPortrait } = useLayoutContext();
  const [storeId, setStoreId] = useState('');
  const alertDialogRef = useRef<AlertDialogMethod>(null);
  const { updateStoreToken, updateStoreInfo } = useAuthContext();

  const login = () => {
    const regex = /^(?=(.*\d){3})(?=(.*[a-zA-Z]){3})[a-zA-Z0-9]{6}$/;

    if (!regex.test(storeId)) {
      alertDialogRef.current?.open({
        title: 'INVALID STORE ID',
        content: 'Please input your correct store ID.'
      });
      return;
    }
    signIn({ storeId }).then((data) => {
      if (!data?.status) {
        alertDialogRef.current?.open({ title: 'LOGIN FAILED', content: data?.message})
        return;
      }
      
      if (data.result) {
        updateStoreInfo(data.result.store);
        updateStoreToken(data.result.token);
      }
    }).catch(() => {
      
    });
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={isPortrait ? { flex: 1 } : {}}>
        <KeyboardAwareScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.logoView}>
                    <Image source={ logoImage } style={styles.logoIcon} />
                </View>
                <Text style={styles.title}>Sign In</Text>
                <TextInput
                    mode="outlined"
                    outlineColor="white"
                    activeOutlineColor="white"
                    placeholder="Enter Store ID"
                    left={
                    <TextInput.Icon icon="email-outline" />
                    }
                    value={storeId}
                    onChangeText={(_) => setStoreId(_)}
                    numberOfLines={1}
                    style={styles.inputArea}
                />
                <Button style={styles.button} labelStyle={styles.buttonLabel} mode="contained" textColor="white" onPress={login}>Sign In</Button>
            </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <AlertDialog ref={alertDialogRef} />
    </>
  );
};

const useStyles = () => {
  const { isPortrait } = useLayoutContext();
  const theme = useTheme();

  return StyleSheet.create({
    screen: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        flex: 1,
    },
    container: {
      marginHorizontal: 'auto',
      width: '100%',
      maxWidth: 600,
      paddingHorizontal: 12,
      paddingTop: 0,
      paddingBottom: 32,
      borderRadius: 24,
      borderColor: theme.colors.primary,
      borderWidth: isPortrait ? 0 : 3,
    },
    content: {
      marginVertical: 'auto',
    },
    form: {
      width: '100%',
      margin: 'auto',
      ...(isPortrait ? {} : { maxWidth: 340 } ),
    },
    title: {
      fontSize: 32,
      fontWeight: '400',
      textAlign: 'center',
      lineHeight: 36,
      letterSpacing: 0,
      marginBottom: 8,
    },
    inputArea: {
        marginTop: 16
    },
    showPasswordBtn: {
        width: 24,
        height: 24
    },
    button: {
      marginTop: isPortrait ? 32 : 48,
      height: 48,
      justifyContent: 'center',
      borderRadius: 8,
    },
    buttonLabel: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700'
    },
    footer: {
      textAlign: 'center',
      fontSize: 12,
    },
    linkText: {
      textDecorationLine: 'underline',
    },
    logoView: {
        width: 100,
        height: 100,
        marginHorizontal: 'auto',
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 50,
        borderWidth: 0,
        borderColor: 'white',
    },
    logoIcon: {
        width: '100%',
        height: '100%',
    },
  });
};

export default LoginScreen;
