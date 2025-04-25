import React, { useEffect, useRef, useState } from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import styles from './style';
import {useLayoutContext} from '../../contexts/layout.context';
import {StepComponentProps} from './type';
import { useAuthContext } from '../../contexts/auth.context';
import { formatDisplayNumber } from '../../utils/format';
import useApi from '../../hooks/useApi';
import { TransactionRequest } from '../../interface/transaction';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';

const ConfirmationStep: React.FC<StepComponentProps> = ({onMoveStep, data}) => {
  const pageStyles = usePageStyles();
  const request = useApi();
  const { storeInfo: { name: storeName } } = useAuthContext();
  const alertDialogRef = useRef<AlertDialogMethod>(null);

  const [isSaving, setIsSaving] = useState(false);

  const saveTransactionResult = (data: TransactionRequest) => request('post', '/transaction/create', data);

  const onConfirmTransaction = () => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    saveTransactionResult(data as TransactionRequest).then((res) => {
      setIsSaving(false);
      if (res.status) {
        onMoveStep(true, data);
        return;
      } else {
        alertDialogRef?.current?.open({
          title: 'Warning',
          content: `Saving transaction is failed because of this error ${res.message}. Try again.`
        })
      }
    });
  }

  return (
    <>
      <View style={pageStyles.storeInfoBox}>
        <Text style={pageStyles.storeName}>{ storeName }</Text>
      </View>
      <View style={pageStyles.infoRow}>
        <Text style={pageStyles.infoTitle}>Amount: </Text>
        <View>
          <View style={pageStyles.currencyInfo}>
            <Text style={pageStyles.currencyUint}>$</Text>
            <Text style={pageStyles.currencyValue}>{formatDisplayNumber((data?.totalAmount || 0) + '')}</Text>
          </View>
        </View>
      </View>
      <Button
        style={[styles.button, pageStyles.button]}
        labelStyle={[styles.buttonLabel, pageStyles.buttonLabel]}
        contentStyle={{ height: '100%' }}
        mode="contained"
        textColor="white"
        onPress={onConfirmTransaction}>
        { isSaving ? 'Processing...' : 'Pay Store with Credits'}
      </Button>
      <AlertDialog ref={alertDialogRef} onClose={() => {}} />
    </>
  );
};

const usePageStyles = () => {
  const {isPortrait} = useLayoutContext();

  return StyleSheet.create({
    storeInfoBox: {
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 16,
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 40,
      // marginTop: 32,
      justifyContent: 'center',
      alignItems: 'center'
    },
    storeName: {
      fontSize: 32,
      fontWeight: '600',
    },
    storeChangeButton: {
      position: 'absolute',
      bottom: 8,
      right: 16,
    },
    infoRow: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 24,
    },
    infoTitle: {
      fontSize: 26,
      fontWeight: '500',
    },
    currencyInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    currencyUint: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 36,
      color: '#F7C41EDB',
    },
    currencyValue: {
      fontSize: 36,
      fontWeight: '600',
      lineHeight: 36,
      marginLeft: 6,
    },
    cryptoInfo: {
      flexDirection: 'row',
    },
    cryptoValue: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
      marginLeft: 6,
    },
    saveLaterButton: {
      position: isPortrait ? 'relative' : 'absolute',
      right: isPortrait ? 0 : 32,
      top: isPortrait ? 0 : 50,
      marginTop: isPortrait ? 24 : 0,
    },
    button: {
      height: 100,
      borderRadius: 20,
      padding: 0
    },
    buttonLabel: {
      fontSize: 22,
      lineHeight: 36,
    },
  });
};
export default ConfirmationStep;
