import React, { useRef, useState } from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {Text, Button, Icon} from 'react-native-paper';
import styles from './style';
import {useLayoutContext} from '../../contexts/layout.context';
import {StepComponentProps} from './type';
import { useNavigation, useRoute } from '@react-navigation/native';
import NumericPad from 'react-native-numeric-pad';
import { NumpadRef } from '../../interface/numberpad';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import { generateNumberPadProps } from '../../constants/numpad';

const InputStep: React.FC<StepComponentProps> = ({onMoveStep}) => {
  const navigation = useNavigation();
  const pageStyles = usePageStyles();
  const route = useRoute();
  const [amount, setAmount] = useState('')
  const numpadRef = useRef<NumpadRef>()
  const { phone } = route.params;
  const alertDialogRef = useRef<AlertDialogMethod>(null);

  const onCreateTransaction = () => {
    if (!amount) {
      alertDialogRef.current?.open({
        title: 'INVALID AMOUNT',
        content: `You didn't input the amount to purchase. Please input the valid amount.`
      });
      return;
    }
    onMoveStep(true, {
      customerPhone: phone,
      amount: parseFloat(parseFloat(amount).toFixed(2))
    });
  };

  return (
    <View style={styles.container}>
      <View style={pageStyles.topArea}>
        <TouchableOpacity style={{ width: 30, marginBottom: 12 }} onPress={() => navigation.goBack()}>
          <Icon
            source='arrow-left'
            color='white'
            size={30}
          />
        </TouchableOpacity>
        <View style={pageStyles.inputArea}>
          {
            amount ? 
            <>
              <Text style={pageStyles.inputText}>$</Text>
              <TextInput
                style={pageStyles.inputText}
                showSoftInputOnFocus={false}
                autoFocus={true}
                editable={false}
                numberOfLines={1}
                value={amount}
              /> 
            </>          
            : <Text style={pageStyles.inputText}>$0</Text>
          }        
        </View>
      </View>
      
      <View style={pageStyles.numberPadArea}>      
        <NumericPad
          ref={numpadRef}
          numLength={8}
          onValueChange={value => {
            setAmount(value);
          }}
          allowDecimal={true}
          onRightBottomButtonPress={() => {numpadRef.current?.clear()}}
          {...generateNumberPadProps(210)}
        />
      </View>
      <Button style={styles.button} labelStyle={styles.buttonLabel} mode="contained" textColor="white" onPress={onCreateTransaction}>
        Purchase
      </Button>
      <AlertDialog ref={alertDialogRef} onClose={() => {}} />
    </View>
  );
};

const usePageStyles = () => {
  const {isPortrait} = useLayoutContext();

  return StyleSheet.create({
    closeButton: {
      position: 'absolute',
      top: 20,
      left: isPortrait ? 12 : 22,
    },
    convertInfo: {
      alignItems: 'center',
      position: isPortrait ? 'relative' : 'absolute',
      marginBottom: isPortrait ? 16 : 0,
      marginTop: isPortrait ? 24 : 0,
      top: isPortrait ? 0 : 32,
      right: isPortrait ? 0 : 12,
    },
    currencyType: {
      fontSize: 24,
      fontWeight: '500',
    },
    topArea: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 40,
    },
    inputArea: {
      width: '100%',
      height: 70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputText: {
      color: 'white',
      textAlign: 'center',
      fontSize: isPortrait ? 46 : 50,
      lineHeight: isPortrait ? 46 : 50,
      letterSpacing: 0
    },
    numberPadArea: {
      width: '100%',
      minHeight: 150,
      marginTop: 0,
    },
  });
};

export default InputStep;
