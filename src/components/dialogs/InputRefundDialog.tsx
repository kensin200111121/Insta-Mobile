import React, {useEffect, useState} from 'react';
import withDialog, { DialogContentProps } from '../WithDialog';
import {  View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ConfirmRefundFormData } from './ConfirmRefundDialog';
import { TransactionItem } from '../../interface/transaction';
import { Checkbox } from 'react-native-paper';
import SelectTransaction from '../SelectTransaction';


const InputRefund: React.FC<DialogContentProps<TransactionItem[], ConfirmRefundFormData>> = ({ data, onClose }) => {
  const [ isShowPartialAmount, setShowPartialAmount ] = useState(false);
  const [ transaction_id, setTransactionId ] = useState('');
  const [ refundAmount, setRefundAmount ] = useState('0');
  const [ transactionAmount, setTransactionAmount ] = useState(0);
  const [ warning, setWarning ] = useState({transaction_id: '', refundAmount: ''});

  useEffect(() => {
    setShowPartialAmount(false);
    setTransactionId('');
    setTransactionAmount(0);
    setRefundAmount('0');
    setWarning({transaction_id: '', refundAmount: ''});
  }, [data]);

  useEffect(() => {
    if(!isShowPartialAmount){
      setRefundAmount(transactionAmount.toString());
    }
  }, [isShowPartialAmount]);

  const handleRefund = () => {
    if(transaction_id == '' || Number.isNaN(Number(refundAmount)) || Number(refundAmount) > transactionAmount || Number(refundAmount) < 0 ){
      setWarning({
        transaction_id: transaction_id == '' ? 'Transaction ID is invalid.' : '',
        refundAmount: Number.isNaN(Number(refundAmount)) || Number(refundAmount) > transactionAmount || Number(refundAmount) < 0 ? 'Refund Amount is invalid.' : ''
      });
    }else{
      onClose({refundAmount: Number(refundAmount), transactionAmount, transaction_id});
    }
  }

  const handleSelect = (item: TransactionItem|undefined) => {
    if(item){
      setTransactionId(item.transaction_id)
      setRefundAmount(item.amount.toFixed(2));
      setTransactionAmount(item.amount);
    }else{
      setTransactionId('');
      setTransactionAmount(0);
      setRefundAmount('0');
    }
  };

  return (
    <View style={{gap: 8}}>
      <SelectTransaction transactions={data} onSelect={handleSelect}/>
      { warning.transaction_id != '' && <Text style={styles.warning}>{warning.transaction_id}</Text>}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setShowPartialAmount(prev => !prev)}
      >
        <Checkbox
          status={isShowPartialAmount ? 'checked' : 'unchecked'}
          theme={{colors: {primary: '#30260B'}}}
        />
        <Text style={{color: '#848484', fontSize: 14}}>Issue Partial Refund</Text>
      </TouchableOpacity>
      { isShowPartialAmount && <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={refundAmount}
        onChangeText={val => { setRefundAmount(val) }}
      />}
      {warning.refundAmount != '' && <Text style={styles.warning}>{warning.refundAmount}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleRefund}>
        <Text style={styles.buttonText}>Refund</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
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

export default withDialog(InputRefund);
