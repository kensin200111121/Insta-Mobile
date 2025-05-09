import React, { useState, useEffect, useRef } from 'react';
import withDialog, { DialogContentProps } from '../WithDialog';
import {  View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import InputRefundAmountDialog, { InputRefundAmountFormData } from './InputRefundAmountDialog';
import { DialogMethod } from '../../components/WithDialog';
import { getPriceNumber } from '../../helpers/numberHelper';
import { TransactionItem } from '../../interface/transaction';

export interface ConfirmRefundFormData{
  refundAmount: number;
  transactionAmount: number;
  transactionInfo: TransactionItem;
}

const ConfirmRefund: React.FC<DialogContentProps<ConfirmRefundFormData, ConfirmRefundFormData>> = ({ data, onClose, hide }) => {
  const [partialAmount, setPartialAmount] = useState(data.refundAmount);

  useEffect(() => {
    setPartialAmount(data.refundAmount);
  }, [data]);

  const inputDialogRef = useRef<DialogMethod<InputRefundAmountFormData>>(null);

  const onInputOpen = () => {
    inputDialogRef.current?.open({ refundAmount: Number(data.transactionAmount.toFixed(2)) });
  };

  const onInputClose = (data?: InputRefundAmountFormData) => {
    if (data) {
      setPartialAmount(data.refundAmount);
    }
  };

  const handleOK = () => {
    onClose({...data, refundAmount: partialAmount});
  }

  return (
    <View style={{gap: 8}}>
      <View style={styles.row}>
        <Text style={styles.highlight}>Amount</Text>
        <Text style={{flex: 1}}>{getPriceNumber(partialAmount)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.highlight}>Transaction ID</Text>
        <Text style={{flex: 1}}>{data.transactionInfo.transaction_id}</Text>
      </View>
      <Text style={styles.questions}>Issue Refund of {getPriceNumber(data.transactionAmount)}?</Text>
      <TouchableOpacity onPress={onInputOpen}>
        <Text style={styles.link}>Issue Partial Refund</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={styles.text}>Confirm Refund ?</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#30260B' }]} onPress={handleOK}>
          <Text style={[styles.buttonText, { color: 'white' }]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {flex: 1}]} onPress={hide}>
          <Text style={styles.buttonText}>
            No
          </Text>
        </TouchableOpacity>
      </View>
      <InputRefundAmountDialog ref={inputDialogRef} title='Enter Refund Amount' onClose={onInputClose} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  highlight: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    flex: 1
  },
  questions: {
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Poppins',
    textAlign: 'center'
  },
  link: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: '#848484',
    textDecorationLine: 'underline'
  },
  text: {
    fontWeight: '300',
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#848484',
    flex: 2
  },
  button: {
    width: '100%',
    height: 26,
    borderRadius: 15,
    backgroundColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flex: 1
  },
  buttonText: {
    fontSize: 12,
  }
});

export default withDialog(ConfirmRefund);
