import React, { FC, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useLayoutContext } from '../../contexts/layout.context';
import NumericPad from 'react-native-numeric-pad';
import { NumpadRef } from '../../interface/numberpad';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import { generateNumberPadProps } from '../../constants/numpad';
import { VerifyPinRequest } from '../../interface/auth';
import { useAuthContext } from '../../contexts/auth.context';
import useStoreApi from '../../hooks/useStoreApi';
import Header from '../../layout/header';
import Background from '../../components/Background';
import { maskInputString } from '../../utils/format';

type PinOverlayProps = {
  title?: string
}

const PinOverlay: FC<PinOverlayProps> = ({title}) => {
  const styles = useStyles();
  const { isPortrait } = useLayoutContext();
  const { updateUserToken, updateStoreInfo } = useAuthContext();
  const request = useStoreApi();
  const [text, setText] = useState('');
  const numpadRef = useRef<NumpadRef>(null)
  const alertDialogRef = useRef<AlertDialogMethod>(null);

  const onChangeText = (_text: string) => {
    setText(_text);
  }

  const verifyPin = (data: VerifyPinRequest) => request('post', '/auth/user', data);

  const onVerify = () => {
    if (!text?.length || text.length < 4) {
      alertDialogRef.current?.open({
        title: 'INVALID CLERK ID',
        content: 'Please input your correct pin code.'
      });
      return;
    }
    verifyPin({ pin: text }).then((data) => {
      if (data.status && data.result.token) {
        updateStoreInfo(data.result.store);
        updateUserToken(data.result.token);
      } else {
        alertDialogRef.current?.open({
          title: 'INVALID CLERK ID',
          content: 'Your pin code is not correct. Please confirm and try again.'
        });
      }
    });
    // navigation.navigate('startup');
  };

  useEffect(() => {
    if (text.length === 4) {
      onVerify();
    }
  }, [text]);

  return (
    <>
      <Header title={title || "Clerk ID"} isCenterTitle />
      <Background />
      <ScrollView contentContainerStyle={isPortrait ? { flex: 1 } : {}}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.form}>
              <TextInput
                placeholder="ENTER PIN TO LOGIN"
                showSoftInputOnFocus={false}
                autoFocus={true}
                editable={false}
                value={maskInputString('____', text)}
                numberOfLines={1}
                style={{ height: 70, fontSize: 48, textAlign: 'center', color: 'white', letterSpacing: 10 }}
              />
              <View style={styles.numberPadArea}>
                <NumericPad
                  ref={numpadRef}
                  numLength={4}
                  onValueChange={onChangeText}
                  allowDecimal={false}
                  onRightBottomButtonPress={() => {numpadRef.current?.clear()}}
                  {...(generateNumberPadProps(100))}
                />
              </View>
            </View>
          </View>
          <AlertDialog ref={alertDialogRef} onClose={() => {}} />
        </View>
      </ScrollView>
    </>
  );
};

const useStyles = () => {
  const { isPortrait } = useLayoutContext();
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      height: !isPortrait ? 640 : '100%',
      margin: 'auto',
      width: '100%',
      maxWidth: 600,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 32,
      borderColor: theme.colors.primary,
      borderWidth: isPortrait ? 0 : 3,
      ...(isPortrait ? { flex: 1 } : { marginVertical: 60 } ),
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
      fontSize: 40,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 40,
      letterSpacing: 0,
      marginBottom: 6,
    },
    guideText: {
      fontSize: 16,
      marginTop: isPortrait ? 8 : 40,
      marginBottom: isPortrait ? 12 : 24,
      textAlign: 'center',
    },
    button: {
      marginTop: isPortrait ? 24 : 32,
      height: 72,
      justifyContent: 'center',
      borderRadius: 24,
    },
    buttonLabel: {
      fontSize: 28,
      lineHeight: 40,
      fontWeight: '700'
    },
    footer: {
      textAlign: 'center',
      fontSize: 12,
    },
    linkText: {
      textDecorationLine: 'underline',
    },
    numberPadArea: {
      width: '100%',
      minHeight: 150,
      marginBottom: 0,
      marginTop: 0,
    },
  });
};

export default PinOverlay;
