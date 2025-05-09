import React, { useEffect, useRef, useState } from 'react';
import Header from '../../layout/header';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { searchIcon } from '../../../assets/svg/search';
import MyTable, { TableColumn } from '../../components/Table';
import { RefundCreateRequest, RefundItem } from '../../interface/refund';
import moment from 'moment';
import useApi from '../../hooks/useApi';
import InputRefundDialog from '../../components/dialogs/InputRefundDialog';
import ConfirmRefundDialog, { ConfirmRefundFormData } from '../../components/dialogs/ConfirmRefundDialog';
import { DialogMethod } from '../../components/WithDialog';
import { TransactionItem } from '../../interface/transaction';
import { useAuthContext } from '../../contexts/auth.context';
import { useLayoutContext } from '../../contexts/layout.context';
import { generateRefundErrorMessage } from '../../utils/messages';

const RefundScreen = () => {
  const { userToken, openTokenOverlay, hasOverlay } = useAuthContext();
  const request = useApi();
  const { showError } = useLayoutContext();
  
  const [dataSource, setDataSource] = useState<RefundItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');

  const GetRefunds = (params?: Record<string, any>) => request('get', '/refund', { params });
  const GetTransactions = (params?: Record<string, any>) => request('get', '/transaction', { params });
  const CreateRefundAsync = (data: RefundCreateRequest) => request('post', '/refund/create', data);

  useEffect(() => {
    if (!userToken) {
      openTokenOverlay('MENU');
      return;
    }
  }, []);

  useEffect(() => {
    if (!hasOverlay) {
      GetRefunds({filters: { isBatched: false }}).then((res) => {
        if (res.status) {
          setDataSource(res.result.data);
        }
      })
      GetTransactions({filters: { isBatched: false }}).then((res) => {
        if (res.status) {
          setTransactions(res.result.data);
        }
      })
    }
  }, [hasOverlay]);

  const inputRefundRef = useRef<DialogMethod<TransactionItem[]>>(null);
  const confirmRefundRef = useRef<DialogMethod<ConfirmRefundFormData>>(null);
  
  const handleRefund = () => {
    if(inputRefundRef){
      inputRefundRef.current?.open(transactions.filter(t => (!t.isRefunded && t.type == 0 && transactions.findIndex(data => data.transaction_id == t.transaction_id + '-CB') < 0)));
    }
  }

  const handleInputRefundClose = (data?: ConfirmRefundFormData) => {
    if(confirmRefundRef && data){
      confirmRefundRef.current?.open(data);
    }
  }

  const handleConfirmRefundClose = (data?: ConfirmRefundFormData) => {
    if(data){
      const index = transactions.findIndex(t => t._id == data.transactionInfo._id);

      if (index >= 0) {
        const transaction: TransactionItem = transactions[index];
        const refundData: RefundCreateRequest = {
          transaction_id: transaction._id,
          amount: data.refundAmount,
        };

        CreateRefundAsync(refundData).then((res) => {
          if(res.status){
            showError('Refund successful!', '');
            dataSource.push(res.result);
            setDataSource([...dataSource]);
            transactions[index].isRefunded = true;
            setTransactions([...transactions]);
          } else if (res.message) {
            showError('Refund failed', generateRefundErrorMessage(res.message) );
          }
        });
      }
    }
  }

  const columns: TableColumn[] = [
    {
      title: 'Original Tx Date',
      dataIndex: 'created_at',
      render: (val: Date) => moment(val).format('MM/DD/YYYY')
    },
    {
      title: 'Refund Date',
      dataIndex: 'refunded_at',
      render: (val: Date) => moment(val).format('MM/DD/YYYY')
    },
    {
      title: 'Time',
      render: (val: any, record: RefundItem) => moment(record.refunded_at).format('hh:mm:ss A')
    },
    {
      title: 'User Name',
      render: (val: any, record: RefundItem) => (record.user?.name)
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id'
    },
    {
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Original Amount',
      dataIndex: 'amount',
      render: (val: number) => (`$${val.toFixed(2)}`)
    },
    {
      title: 'Refunded Amount',
      dataIndex: 'refund',
      render: (val: number) => (`$${val.toFixed(2)}`)
    }
  ];

  return (
    <>
      <Header hasMenu/>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextInput style={styles.search} placeholder='Enter last 4/Name/ Number' placeholderTextColor='#929292' value={searchKey} onChangeText={val => setSearchKey(val)}/>
            <TouchableOpacity><SvgXml xml={searchIcon} /></TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.title}>Refunds</Text>
              <TouchableOpacity style={styles.button} onPress={handleRefund}>
                <Text style={styles.buttonText}>Create New Refund</Text>
              </TouchableOpacity>
            </View>
            <MyTable columns={columns} dataSource={dataSource.filter(d => d.transaction_id.includes(searchKey))}/>
          </View>
          <InputRefundDialog ref={inputRefundRef} title='Create New Refund' onClose={handleInputRefundClose} />
          <ConfirmRefundDialog ref={confirmRefundRef} title='Refund Confirmation' onClose={handleConfirmRefundClose} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingTop: 24,
    backgroundColor: '#F3F3F3',
    flex: 1,
    gap: 24,
    minHeight: '100%'
  },
  header: {
    borderRadius: 15,
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  search: {
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    lineHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 235,
    fontSize: 12
  },
  content: {
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 15
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: 'black',
    fontFamily: 'Poppins',
  },
  button: {
    width: 150,
    height: 26,
    borderRadius: 15,
    backgroundColor: '#C21010',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 12,
    color: 'white'
  }
});

export default RefundScreen;
