import React, {useMemo, useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {useLayoutContext} from '../../contexts/layout.context';
import InputStep from './InputStep';
import ConfirmationStep from './ConfirmStep';
import ApprovedStep from './ApprovedStep';
import TipPrompt from './TipPrompt';
import Header from '../../layout/header';
import { TransactionRequest } from '../../interface/transaction';
import { useAuthContext } from '../../contexts/auth.context';
import WaitingDialog, { WaitingDialogMethod } from './WaitingDialog';

const StepComponents = [InputStep, TipPrompt, ConfirmationStep, ApprovedStep];
const StepTitle = ['PURCHASE CREDITS', '', 'USE CREDITS', '']

const Purchase = () => {
  const styles = useStyles();
  const { storeInfo: { noTip } } = useAuthContext();
  const [activeStep, setActiveStep] = useState(0);
  const StepComponent = useMemo(
    () => StepComponents[activeStep] || ConfirmationStep,
    [activeStep],
  );
  const [data, setData] = useState<TransactionRequest>({
    customerPhone: '',
    amount: 0,
    tip: 0
  });
  const dialogRef = useRef<WaitingDialogMethod>(null);

  const onMoveStep = (isNext = true, _data?: TransactionRequest) => {
    _data && setData(_data);
    if (isNext) {
      if (activeStep === 0) {
        if (noTip) {
          // show the breakdown dialog
          showBreakdownDialog(_data);
          return;
        } else {
          setActiveStep(activeStep + (isNext ? 1 : -1));
          return;
        }
      }
    }
    setActiveStep(activeStep + (isNext ? 1 : -1));
  };

  const showBreakdownDialog = (data: TransactionRequest) => {
    dialogRef.current?.open({
      customerPhone: data.customerPhone,
      amount: data.amount,
      tip: 0,
    });
  };

  const onPurchaseHandle = (_data: any) => {
    if (!_data) {
      return;
    }
    setData({
      customerPhone: _data.customerPhone,
      amount: _data.amount,
      tip: 0,
      ..._data
    });
    setActiveStep(activeStep + 2);
  };

  return (
    <>
      <Header title={StepTitle[activeStep]} isCenterTitle hasTerm={activeStep === 1} />
      <ScrollView contentContainerStyle={{flex: 1, paddingVertical: 12}}>
        <View style={styles.stepContainer}>
          <StepComponent onMoveStep={onMoveStep} data={data} />
        </View>
      </ScrollView>
      <WaitingDialog ref={dialogRef} onClose={onPurchaseHandle} />
    </>
  );
};

const useStyles = () => {
  const theme = useTheme();
  const {isPortrait} = useLayoutContext();

  return StyleSheet.create({
    stepIndexes: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: isPortrait ? 50 : 80,
      marginBottom: isPortrait ? 40 : 40,
      marginHorizontal: 'auto',
      width: isPortrait ? '50%' : '60%',
    },
    stepIndex: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#30260B',
    },
    activeStepIndex: {
      backgroundColor: '#F7C41E',
    },
    stepIndexGapper: {
      height: 1,
      backgroundColor: isPortrait ? 'transparent' : 'gainsboro',
      position: 'absolute',
      width: '100%',
      top: 14,
    },
    stepContainer: {
      alignItems: 'center',
      paddingHorizontal: 12,
      width: '100%',
      maxWidth: 600,
      marginHorizontal: 'auto',
      marginVertical: 'auto',
      flex: 1
    },
  });
};

export default Purchase;
