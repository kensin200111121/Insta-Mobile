import React, { useMemo, useRef, useState } from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Icon, Text } from 'react-native-paper';
import styles from './style';
import { StepComponentProps } from './type';
import CustomTipDialog, { CustomTipDialogMethod } from './CustomTipDialog';
import WaitingDialog, { WaitingDialogMethod } from './WaitingDialog';
import { useAuthContext } from '../../contexts/auth.context';
import { ceilTo2Decimals, formatDisplayNumber } from '../../utils/format';

const calcualteTipAmountText = (mode: string, tipAmount: number, totalAmount: number, defaultValue: number) => {
  if (mode === 'fixed') {
    return `$${formatDisplayNumber((tipAmount || defaultValue) + '')}`;
  } else {
    const amount = totalAmount * tipAmount / 100;
    return `$${formatDisplayNumber((amount || defaultValue) + '')}`
  }
}

const calcualteTipAmount = (mode: string, tipAmount: number, totalAmount: number, defaultValue: number) => {
  if (mode === 'fixed') {
    return ceilTo2Decimals(tipAmount || defaultValue);
  } else {
    const amount = totalAmount * tipAmount / 100;
    return ceilTo2Decimals(amount || defaultValue);
  }
}

const TipPrompt: React.FC<StepComponentProps> = ({ data, onMoveStep }) => {
  const { storeInfo: { tipMode: tipMode, tipAmounts: tipAmounts } } = useAuthContext(); 
  const tips = useMemo(() => {return [1, 2, 3]}, []);
  const [selectedTipAmount, selectTipAmount] = useState(0);
  const customTipDialogRef = useRef<CustomTipDialogMethod>(null);
  const dialogRef = useRef<WaitingDialogMethod>(null);

  const onSelectTip = (amount: number) => {
    selectTipAmount(amount);
    dialogRef.current?.open({
        customerPhone: data.customerPhone,
        amount: data.amount,
        tip: amount,
    });
  }

  const onSelectCustomTip = () => {
    customTipDialogRef.current?.open();
  }

  const onInputCustomTip = (amount?: number) => {
    if (amount) {
        onSelectTip(ceilTo2Decimals(amount));
    }
  }

  const onPurchaseHandle = (data: any) => {
    if (!data) {
      return;
    }
    onMoveStep(true, {
        customerPhone: data.customerPhone,
        amount: data.amount,
        tip: selectedTipAmount,
        ...data
    });
  };

  return (
    <>
      <View style={pageStyles.backContainer}>
        <TouchableOpacity onPress={() => onMoveStep(false)}>
          <Icon
            source='arrow-left'
            color='white'
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add a Tip?</Text>
        <Text style={[styles.headerText, {width: 25}]}> </Text>
      </View>
      <View style={pageStyles.container}>
        <View style={pageStyles.fixedTips}>
            {
                tips.map((tip, index) => (
                    <TouchableOpacity key={index} style={[pageStyles.tipButton, pageStyles.horizontalButton]} onPress={() => onSelectTip(calcualteTipAmount(tipMode, tipAmounts[index], data.amount, tip))}>
                        <Text style={[pageStyles.tipButtonText, (calcualteTipAmount(tipMode, tipAmounts[2], data.amount, tip) < 100 ? {} : {fontSize: 22} )]} ellipsizeMode="clip">{calcualteTipAmountText(tipMode, tipAmounts[index], data.amount, tip)}</Text>
                        {tipMode === 'percentage' ? <Text style={pageStyles.tipModeValueText}>({tipAmounts[index]}%)</Text> : null}
                    </TouchableOpacity>
                ))
            }   
        </View>
        <TouchableOpacity style={pageStyles.tipButton} onPress={onSelectCustomTip}>
            <Text style={[pageStyles.tipButtonText, pageStyles.verticalButtonText]}>Custom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={pageStyles.tipButton} onPress={() => onSelectTip(0)}>
            <Text style={[pageStyles.tipButtonText, pageStyles.verticalButtonText]}>No Tip</Text>
        </TouchableOpacity>
      </View>
      <CustomTipDialog ref={customTipDialogRef} onClose={onInputCustomTip} />
      <WaitingDialog ref={dialogRef} onClose={onPurchaseHandle} />
    </>
  );
};

const pageStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  fixedTips: {
    flexDirection: 'row',
    width: '100%'
  },
  tipButton: {
    backgroundColor: '#F7C41E',
    margin: 4,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  horizontalButton: {
    flex: 1,
    height: 150,
    padding: 0
  },
  verticalButton: {
    height: 75,
  },
  tipButtonText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center'
  },
  tipModeValueText: {
    fontSize: 20,
    fontWeight: '700'
  },
  verticalButtonText: {
    fontSize: 18
  },
  backContainer: {
    width: '100%',
    paddingHorizontal: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default TipPrompt;
