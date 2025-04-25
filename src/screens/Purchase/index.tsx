import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {useLayoutContext} from '../../contexts/layout.context';
import InputStep from './InputStep';
import ConfirmationStep from './ConfirmStep';
import ApprovedStep from './ApprovedStep';
import TipPrompt from './TipPrompt';
import Header from '../../layout/header';
import { TransactionRequest } from '../../interface/transaction';

const StepComponents = [InputStep, TipPrompt, ConfirmationStep, ApprovedStep];
const StepTitle = ['PURCHASE CREDITS', '', 'USE CREDITS', '']

const Purchase = () => {
  const styles = useStyles();
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

  const onMoveStep = (isNext = true, _data?: TransactionRequest) => {
    _data && setData(_data);
    setActiveStep(activeStep + (isNext ? 1 : -1));
  };

  return (
    <>
      <Header title={StepTitle[activeStep]} isCenterTitle hasTerm={activeStep === 1} />
      <ScrollView contentContainerStyle={{flex: 1, paddingVertical: 12,}}>
        <View style={styles.stepContainer}>
          <StepComponent onMoveStep={onMoveStep} data={data} />
        </View>
      </ScrollView>
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
      paddingHorizontal: isPortrait ? 12 : 80,
      width: '100%',
      maxWidth: 600,
      marginHorizontal: 'auto',
      marginVertical: 'auto'
    },
  });
};

export default Purchase;
