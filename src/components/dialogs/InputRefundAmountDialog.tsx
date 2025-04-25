import React, { useState, useEffect } from 'react';
import withDialog, { DialogContentProps } from '../WithDialog';
import {  View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export interface InputRefundAmountFormData{
  refundAmount: number
}

const InputRefundAmount: React.FC<DialogContentProps<InputRefundAmountFormData, InputRefundAmountFormData>> = ({ data, onClose, hide }) => {
  const [ amountLimit, setAmountLimit ] = useState(0);
  const [ refundAmount, setRefundAmount ] = useState('0');
  const [ warning, setWarning ] = useState('');

  useEffect(() => {
    setAmountLimit(data.refundAmount);
    setRefundAmount(data.refundAmount.toString());
    setWarning('');
  }, [data]);

  const handleOK = async () => {
    if( Number.isNaN(Number(refundAmount)) || Number(refundAmount) > amountLimit || Number(refundAmount) < 0){
      setWarning('Refund amount is invalid.');
    }else{
      onClose({refundAmount: Number(refundAmount)});
    }
  };

  return (
    <View style={{gap: 8}}>
      <TextInput
        style={styles.input}
        inputMode='decimal'
        placeholder='Enter Refund Amount'
        value={refundAmount}
        onChangeText={val => setRefundAmount(val)}
      />
      { warning != '' && <Text style={styles.warning}>{warning}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleOK}>
        <Text style={styles.buttonText}>Yes</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    lineHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 12
  },
  button: {
    width: '100%',
    height: 26,
    borderRadius: 15,
    backgroundColor: '#30260B',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    fontSize: 12,
    color: 'white'
  },
  warning: {
    fontSize: 12,
    color: 'red'
  }
});

export default withDialog(InputRefundAmount);
