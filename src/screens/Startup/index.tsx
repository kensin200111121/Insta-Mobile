import React, { useEffect, useRef } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Icon, Text } from 'react-native-paper';
import { useLayoutContext } from '../../contexts/layout.context';
import Header from '../../layout/header';
import NumericPad from 'react-native-numeric-pad';
import { NumpadRef } from '../../interface/numberpad';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import { generateNumberPadProps } from '../../constants/numpad';
import { maskInputString } from '../../utils/format';
import { saveLog } from '../../api/auth.api';
import { useAuthContext } from '../../contexts/auth.context';

const Startup = () => {
  const { updateUserToken } = useAuthContext();
  const styles = useStyles();
  const { isPortrait } = useLayoutContext();
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const numpadRef = useRef<NumpadRef>()
  const alertDialogRef = useRef<AlertDialogMethod>(null);

  const onBuyCredit = () => {
    if (!text?.length || text.length < 10) {
      alertDialogRef.current?.open({
        title: 'INVALID PHONE #',
        content: 'Please input your valid phone number.'
      });
      return;
    }
    navigation.navigate('purchase', { phone: text });
  };

  useEffect(() => {
    const eventListners = DeviceEventEmitter.addListener('onDejavooEvent', (data) => {
      saveLog({
        data: JSON.stringify(data)
      }).then(() => {
        console.log('saved log');
      }).catch((err) => {
        console.log('save log is failed', err);
      });
    });

    return () => {
      eventListners.remove();
    }
  }, [])

  useEffect(() => {
    if (text.length === 10) {
      onBuyCredit();
    }
  }, [text]);

  return (
    <>
      <Header title='ENTER PHONE #' isCenterTitle />
      <ScrollView contentContainerStyle={isPortrait ? { flex: 1 } : {}}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.backContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => updateUserToken('')}>
                  <Icon
                    source='arrow-left'
                    color='white'
                    size={30}
                  />
                </TouchableOpacity>
                <TextInput
                  placeholder="Phone Number"
                  showSoftInputOnFocus={false}
                  autoFocus={true}
                  editable={false}
                  value={maskInputString('___-___-____', text)}
                  numberOfLines={1}
                  style={{ height: 70, fontSize: 40, textAlign: 'center', color: 'white', letterSpacing: 2, flex: 1 }}
                />
              </View>
              <View style={styles.numberPadArea}>      
                <NumericPad
                  ref={numpadRef}
                  numLength={10}
                  onValueChange={value => setText(value)}
                  allowDecimal={false}
                  onRightBottomButtonPress={() => {numpadRef.current?.clear()}}
                  {...(generateNumberPadProps(100))}
                />
              </View>
              {/* <Button style={styles.button} labelStyle={styles.buttonLabel} mode="contained" textColor="white" onPress={onBuyCredit}>Continue</Button> */}
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
      height: 60,
      justifyContent: 'center',
      borderRadius: 30,
    },
    buttonLabel: {
      fontSize: 24,
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
    backContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }  
  });
};

export default Startup;
