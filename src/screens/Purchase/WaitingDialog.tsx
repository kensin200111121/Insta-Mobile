import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DeviceEventEmitter, Image, NativeModules, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useAuthContext } from '../../contexts/auth.context';
import { TransactionRequest, TransactionResponse } from '../../interface/transaction';
import { ceilTo2Decimals, formatDisplayNumber } from '../../utils/format';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import useApi from '../../hooks/useApi';
import { saveLog } from '../../api/auth.api';

const logoImage = require('../../../assets/icons/logo.png');

const { DejavooPaymentModule } = NativeModules;

export type WaitingDialogMethod = {
    open: (_: TransactionRequest) => void
}

export type WaitingDialogProps = {
    onClose: (_: any) => void
}

const calculateFeeAmount = (noFee: boolean, total: number, isFixed: boolean, fixedAmount: number, isPercentage: boolean, percentageAmount: number) => {
    if (noFee) {
        return 0;
    }
    const fixedFee = isFixed ? fixedAmount || 0 : 0;
    const percentageFee = isPercentage ? total * (percentageAmount || 0) / 100 : 0;
    return ceilTo2Decimals(fixedFee + percentageFee);
}

const WaitingDialog = React.forwardRef<WaitingDialogMethod, WaitingDialogProps>(({ onClose }, ref) => {
    useImperativeHandle(ref, () => {
        return {
            open: (_data) => {
                const _convenienceFee = calculateFeeAmount(noConvenienceFee, parseFloat((_data.amount || 0) + '') + parseFloat((_data.tip || 0) + ''), fixedFeeMode, fixedFeeAmount, percentageFeeMode, percentageFeeAmount);
                const _totalAmount = parseFloat((_data.amount || 0) + '') + parseFloat((_data.tip || 0) + '') + parseFloat((_convenienceFee || 0) + '');
                const data = {
                    ..._data,
                    totalAmount: _totalAmount,
                    convenienceFee: _convenienceFee,
                }
                setData({ ...data });
                setTotalAmount(_totalAmount);
                showDialog();
                timer.current = setTimeout(() => {
                    purchase(data as TransactionRequest);
                }, 3000);
            },
        };
    }, []);

    const { storeInfo: { fixedFeeAmount, fixedFeeMode, percentageFeeMode, percentageFeeAmount, noTip, noConvenienceFee } } = useAuthContext();
    const request = useApi();
    const [visible, setVisible] = React.useState(false);
    const [data, setData] = useState<TransactionRequest>();
    const [totalAmount, setTotalAmount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const tpn = useRef('');
    
    const timer = useRef<any>(); // remove later
    const alertDialogRef = useRef<AlertDialogMethod>(null);

    const saveTransactionResult = (data: TransactionRequest) => request('post', '/transaction/create', data);

    useEffect(() => {
        let data = { applicationType: "DVPAYLITE" };
        DejavooPaymentModule.getTPN(JSON.stringify(data));
    }, []);

    useEffect(() => {
        const eventListners = DeviceEventEmitter.addListener('onDejavooEvent', dejavooEventHandler);

        return () => {
            eventListners.remove();
        }
    }, [data]);

    const showDialog = () => setVisible(true);

    const hideDialog = () => {
        clearData();
        onClose(false);
    };

    const clearData = () => {
        setVisible(false);
        timer.current && clearTimeout(timer.current);
        timer.current = undefined;
    }

    const dejavooEventHandler = useCallback((_data: any) => {
        if (_data.type === 'onGetTPN') {
            const response = JSON.parse(_data?.data) as any;
            tpn.current = response.tpn || response.TPN;
        }
        if (_data.type === 'onTransactionSuccess') {
            try {
                const response = JSON.parse(_data?.data) as TransactionResponse;
                const resultData = {
                    ...data,
                    transaction: {
                        ...response,
                        terminal: tpn.current
                    },
                };                
                if (!data?.customerPhone || !parseFloat(data.amount + '') || !parseFloat(data.totalAmount + '')) {
                    saveLog({ data: JSON.stringify({ type: 'invalid_hook', ...resultData }) });
                    return;
                }
                timer.current && clearTimeout(timer.current);
                timer.current = undefined;
                
                saveTransactionResult(resultData as TransactionRequest).then((res) => {
                    if (res.status) {
                      setVisible(false);
                      onClose(resultData);
                      return;
                    } else {
                        alertDialogRef?.current?.open({
                            title: 'Warning ',
                            content: `Saving transaction (${resultData?.transaction?.refId}:${resultData?.transaction?.transId}) is failed because of this error ${res.message}. Contact to support team with this message.`,
                        })
                        setVisible(false);
                        onClose(resultData);
                    }
                });
            } catch (err) {
                console.log('error', err);
            }
        } else if (_data.type === 'onTransactionFailed' || _data.type === 'onApplicationLaunchFailed') {
            try {
                const response = JSON.parse(_data?.data);
                alertDialogRef?.current?.open({
                    title: 'FAILED',
                    content: `There is an issue in the purchasing because of this error : ${response.error_message || _data.type}. Please try again.`,
                    actionBtnLabel: 'Retry',
                    cancelLabel: 'Cancel'
                })
            } catch (err) {
                console.log('error', err);
            }
        }
    }, [data])

    const createTransaction = (_data: TransactionRequest) => {
        let request = { "type": "SALE", "amount": _data?.totalAmount || 0, "applicationType": "DVPAYLITE", "refId": Date.now(), receiptType: 'Merchant' };
        DejavooPaymentModule.createTransaction(JSON.stringify(request));
        // const data = { ...transactionResponse, request }
        // DejavooPaymentModule.createTransactionMock(JSON.stringify(data));
    }

    const purchase = (_data: TransactionRequest) => {
        createTransaction(_data);
    }

    const reAttempt = (retry: boolean) => {
        if (!retry) {
            hideDialog();
            return;
        }
        if (!data) {
            return;
        }
        const _convenienceFee = calculateFeeAmount(noConvenienceFee, parseFloat((data.amount || 0) + '') + parseFloat((data.tip || 0) + ''), fixedFeeMode, fixedFeeAmount, percentageFeeMode, percentageFeeAmount);
        const _totalAmount = parseFloat((data.amount || 0) + '') + parseFloat((data.tip || 0) + '') + parseFloat((_convenienceFee || 0) + '');
        purchase(
            {
                ...data,
                totalAmount: _totalAmount,
                convenienceFee: _convenienceFee,
            } as TransactionRequest
        );
    }


    return (
        <>
            <Portal>
                <Dialog dismissable={false} visible={visible} onDismiss={hideDialog} style={styles.content}>
                    <>
                        <Image source={logoImage} style={styles.logoIcon} />
                        <Dialog.Title style={styles.title}>
                            {`PURCHASING $${formatDisplayNumber((totalAmount || 0) + '')}`}
                        </Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium" style={[styles.description]}>Waiting... Processing will be started...</Text>
                            <View style={styles.infos}>
                                <View style={styles.info}>
                                    <Text style={styles.infoTitle}>Amount</Text>
                                    <Text style={styles.infoValue}>${formatDisplayNumber((data?.amount || 0) + '')}</Text>
                                </View>
                                {
                                    noTip ? null : (
                                        <View style={styles.info}>
                                            <Text style={styles.infoTitle}>Tip</Text>
                                            <Text style={styles.infoValue}>${formatDisplayNumber((data?.tip || 0) + '')}</Text>
                                        </View>
                                    )
                                }
                                {
                                    noConvenienceFee ? null : (
                                        <View style={styles.info}>
                                            <Text style={styles.infoTitle}>Convenience Fee</Text>
                                            <Text style={styles.infoValue}>${formatDisplayNumber((data?.convenienceFee || 0) + '')}</Text>
                                        </View>
                                    )
                                }
                                <View style={styles.info}>
                                    <Text style={styles.infoTitle}>Grand Total</Text>
                                    <Text style={styles.infoValue}>${formatDisplayNumber((totalAmount || 0) + '', false)}</Text>
                                </View>
                            </View>
                        </Dialog.Content>
                        <Dialog.Actions style={{ justifyContent: 'center' }}>
                            <Button mode="contained" style={{ width: '100%', backgroundColor: '#30260B' }}
                                textColor="white" onPress={hideDialog}>Cancel</Button>
                        </Dialog.Actions></>
                </Dialog>
            </Portal>
            <AlertDialog ref={alertDialogRef} onClose={reAttempt} />
        </>
    );
});

const styles = StyleSheet.create({
    content: {
        borderRadius: 16,
        // backgroundColor: '#30260B',
        marginHorizontal: 16,
    },
    title: {
        color: 'black',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '900'
    },
    description: {
        textAlign: 'center',
        color: 'gray'
    },
    warning: {
        color: 'red'
    },
    logoIcon: {
        width: 80,
        height: 80,
        marginHorizontal: 'auto',
        marginTop: 24
    },
    infos: {
        marginTop: 16,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginHorizontal: 'auto',
        marginTop: 6
    },
    infoTitle: {
        color: 'black',
        fontSize: 16,
    },
    infoValue: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    }
})

export default WaitingDialog;
