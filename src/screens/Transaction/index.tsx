import React, { useEffect, useRef, useState } from 'react';
import Header from '../../layout/header';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Image, NativeModules, DeviceEventEmitter } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { searchIcon } from '../../../assets/svg/search';
import MyTable, { TableColumn } from '../../components/Table';
import { TransactionItem } from '../../interface/transaction';
import moment from 'moment';
import { transactionStatusList } from '../../constants/data';
import { getPriceNumber } from '../../helpers/numberHelper';
import useApi from '../../hooks/useApi';
import InputRefundDialog from '../../components/dialogs/InputRefundDialog';
import ConfirmRefundDialog, { ConfirmRefundFormData } from '../../components/dialogs/ConfirmRefundDialog';
import { DialogMethod } from '../../components/WithDialog';
import { RefundCreateRequest } from '../../interface/refund';
import { useAuthContext } from '../../contexts/auth.context';
import GradientMark from '../../components/GradientMark';
import { Icon, MD3Colors } from 'react-native-paper'
import { formatDisplayNumber } from '../../utils/format';
import generateRefundReceiptText from '../../utils/print';
import { useLayoutContext } from '../../contexts/layout.context';
import { generateRefundErrorMessage } from '../../utils/messages';
const {DejavooPaymentModule} = NativeModules;

const visaCardImage = require('../../../assets/card/card_VISA.png');
const masterCardImage = require('../../../assets/card/card_MASTERCARD.png');
const discoverCardImage = require('../../../assets/card/card_DISCOVER.png');
const americanExpressCardImage = require('../../../assets/card/card_AMERICANEXPRESS.png');

const IMAGES: Record<string, any> = {
  VISA: visaCardImage,
  MASTERCARD: masterCardImage,
  DISCOVER: discoverCardImage,
  AMEX: americanExpressCardImage
}


const TransactionScreen = () => {
  const { userToken, openTokenOverlay, hasOverlay, storeInfo } = useAuthContext();
  const { showError } = useLayoutContext();
  const request = useApi();
  
  const GetTransactions = (params?: Record<string, any>) => request('get', '/transaction', { params });
  const CreateRefundAsync = (data: RefundCreateRequest) => request('post', '/refund/create', data);

  const inputRefundRef = useRef<DialogMethod<TransactionItem[]>>(null);
  const confirmRefundRef = useRef<DialogMethod<ConfirmRefundFormData>>(null);
  
  const handleRefund = () => {
    if(inputRefundRef){
      inputRefundRef.current?.open(dataSource.filter(d => (d.type == 0 && !d.isRefunded && dataSource.findIndex(data => data.transaction_id == d.transaction_id + '-CB') < 0)));
    }
  }

  const handleInputRefundClose = (data?: ConfirmRefundFormData) => {
    if(confirmRefundRef && data){
      confirmRefundRef.current?.open(data);
    }
  }

  const handleConfirmRefundClose = (data?: ConfirmRefundFormData) => {
    if(data){
      const index = dataSource.findIndex(t => t._id == data.transactionInfo._id);

      if (index >= 0) {
        const transaction: TransactionItem = dataSource[index];
        const refundData: RefundCreateRequest = {
          transaction_id: transaction._id,
          amount: data.refundAmount,
        };

        CreateRefundAsync(refundData).then((res) => {
          if(res.status){
            showError('Refund successful!', '');
            GetTransactions({filters: { isBatched: false }}).then((res) => {
              if (res.status) {
                setDataSource(res.result.data);
                setBatchAmount(res.result.data.reduce((sum: number, item: TransactionItem) => sum += item.net_amount, 0))
              }
            })
          } else if (res.message) {
            showError('Refund failed', generateRefundErrorMessage(res.message));
          }
        });
      }
    }
  }

  const handlePrint = (data: string, record: TransactionItem) => {
    if (!storeInfo) {
      return;
    }
    if (record.type === 0) {
      DejavooPaymentModule.printReceipt(data);
    } else if (record.type === 1) {
      const receiptText = generateRefundReceiptText(record, storeInfo);
      DejavooPaymentModule.printReceipt(receiptText);
    } else {

    }
  }

  const [dataSource, setDataSource] = useState<TransactionItem[]>([]);
  const [batchAmount, setBatchAmount] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>('');

  useEffect(() => {
    if (!userToken) {
      openTokenOverlay('MENU');
      return;
    }

    const eventListners = DeviceEventEmitter.addListener('onDejavooEvent', (data) => {
      
    });

    return () => {
      eventListners.remove();
    }
  }, []);

  useEffect(() => {
    if (!hasOverlay) {
      GetTransactions({filters: { isBatched: false }}).then((res) => {
        if (res.status) {
          setDataSource(res.result.data);
          setBatchAmount(res.result.data.reduce((sum: number, item: TransactionItem) => sum += item.net_amount, 0))
        }
      })
    }
  }, [hasOverlay])
  
  const columns: TableColumn[] = [
    {
      title: 'Date',
      render: (val: any, record: TransactionItem) => moment(record.created_at).format('MM/DD/YYYY'),
    },
    {
      title: 'Time',
      render: (val: any, record: TransactionItem) => moment(record.created_at).format('hh:mm:ss A'),
    },
    {
      title: 'User Name',
      render: (val: any, record: TransactionItem) => (<Text style={styles.text}>{record.user?.name}</Text>),
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
      title: 'Card #',
      dataIndex: 'card_number',
    },
    {
      title: 'Card Brand',
      dataIndex: 'card_brand',
      render: (val: string) => (IMAGES[val] ? <Image source={IMAGES[val]} style={styles.cardImage} /> : null ),
    },
    {
      title: 'Card Type',
      dataIndex: 'card_type',
      render: (val: string) => (<GradientMark type={val === 'Debit' ? 0 : 1} />)
    },
    {
      title: 'Authorization Code',
      dataIndex: 'response_code',
    },
    {
      title: 'Base Amount',
      dataIndex: 'base_amount',
      render: (val: any, record: TransactionItem) => (<Text style={styles.text}>{getPriceNumber(val)}</Text>)
    },    
    {
      title: 'Tip',
      dataIndex: 'tip',
      render: (val: number) => (<Text style={styles.text}>{getPriceNumber(val)}</Text>)
    },
    {
      title: 'Convenience Fee',
      dataIndex: 'convenience_fee',
      render: (val: number) => (<Text style={styles.text}>{getPriceNumber(val)}</Text>)
    },
    {
      title: 'Gross Amount',
      dataIndex: 'amount',
      render: (val: any) => (
        <Text style={styles.text}>{getPriceNumber(val)}</Text>
      )
    },
    {
      title: 'Processing Fee',
      dataIndex: 'processing_fee',
      render: (val: any) => (<Text style={styles.text}>{getPriceNumber(val)}</Text>)
    }, 
    {
      title: 'Net Amount',
      dataIndex: 'net_amount',
      render: (val: any) => (
        <Text style={styles.text}>{getPriceNumber(val)}</Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: number) => (
        <Icon
          source={val ? 'check' : 'close'}
          color={val ? '#00FF00' : MD3Colors.error50}
          size={20}
        />
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (val: number) => (<GradientMark type={val+2} />)
    },
    {
      title: 'Print',
      dataIndex: 'detail',
      render: (val: Record<string, any>, record: TransactionItem) => ( val?.merchant ? (<TouchableOpacity style={styles.button} onPress={() => handlePrint(val.merchant, record)}>
      <Text style={styles.buttonText}>Print</Text>
    </TouchableOpacity>) : null )
    }
  ];

  return (
    <>
      <Header hasMenu/>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextInput style={styles.search} placeholder='Enter last 4/Name/ Number' placeholderTextColor='#929292' value={searchKey} onChangeText={val => setSearchKey(val)} />
            <TouchableOpacity><SvgXml xml={searchIcon} /></TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.infoTitle}>Batch Amount: {batchAmount < 0 && '-'}${formatDisplayNumber(Math.abs(batchAmount).toString())}</Text>
            <Text style={styles.infoTitle}>TX Count: {dataSource.length}</Text>
            <View style={styles.contentHeader}>
              <Text style={styles.title}>Transactions</Text>
              <TouchableOpacity style={styles.button} onPress={handleRefund}>
                <Text style={styles.buttonText}>Refund</Text>
              </TouchableOpacity>
            </View>
            <MyTable columns={columns} dataSource={dataSource.filter(d => d.transaction_id.includes(searchKey))} rowStyle={(item => item.isRefunded ? styles.rowHighlight : {})} />
          </View>
          <InputRefundDialog ref={inputRefundRef} title='Issue Refund' onClose={handleInputRefundClose} />
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
    marginBottom: 20,
    marginTop: 6
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: 'black',
    fontFamily: 'Poppins',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: 'black',
    fontFamily: 'Poppins',
  },
  button: {
    width: 100,
    height: 26,
    borderRadius: 15,
    backgroundColor: '#C21010',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 12,
    color: 'white'
  },
  text: {
    fontSize: 12
  },
  textSuccess: {
    fontSize: 12,
    color: '#5FDDAB'
  },
  textDanger: {
    fontSize: 12,
    color: '#FE7551'
  },
  textBlue: {
    fontSize: 12,
    color: '#1a6fe5'
  },
  textGold: {
    fontSize: 12,
    color: '#FFB03B'
  },
  cardLogo: {
    height: 20,
    width: 30
  },
  rowHighlight: {
    backgroundColor: '#FEF3D1'
  },
  cardImageWrapper: {
    width: 60
  },
  cardImage: {
    width: 50,
    height: 25,
    backgroundColor: 'red'
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
  }
});

export default TransactionScreen;
