import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, View, NativeModules, NativeEventEmitter, DeviceEventEmitter} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/auth.context';
import { formatDisplayNumber } from '../../utils/format';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
import { saveLog } from '../../api/auth.api';
const {DejavooPaymentModule} = NativeModules;

const TestScreen: React.FC = () => {
  const navigation = useNavigation();
  const dialogRef = useRef<AlertDialogMethod>(null);
  const [tpn, setTPN] = useState('');

  useEffect(() => {
    const eventListners = DeviceEventEmitter.addListener('onDejavooEvent', (data) => {
      // dialogRef.current?.open({
      //   title: data?.type || 'Dejavoo Event',
      //   content: data?.data || JSON.stringify(data)
      // });
      saveLog({
        data: JSON.stringify(data)
      }).then(() => {
        console.log('saved log');
      }).catch((err) => {
        console.log('save log is failed', err);
      });
      try {
        const response = JSON.parse(data?.data);
        if (response?.tpn) {
          setTPN(response.tpn);
        }
      } catch (err) {
        console.log('error', err);
      }
    });

    DejavooPaymentModule.setupDejavoo();

    return () => {
      eventListners.remove();
    }
  }, [])

  const callSaveLog = (data: Object) => {
    saveLog({
      data: JSON.stringify(data)
    }).then(() => {
      console.log('saved log');
    }).catch((err) => {
      console.log('save log is failed', err);
    });
  }

  const getTPN = () => {
    let data = { applicationType: "DVPAYLITE" };
    callSaveLog({...data, requestType: 'getTPN'});
    DejavooPaymentModule.getTPN(JSON.stringify(data));
  }

  const openTerminal = () => {
    let data = { applicationType: "DVPAYLITE", tpn };
    callSaveLog({...data, requestType: 'openTerminal'});
    DejavooPaymentModule.openTerminal(JSON.stringify(data));
  };

  const getDevice = () => {
    let data = { applicationType: "DVPAYLITE" };
    callSaveLog({...data, requestType: 'getDevice'});
    DejavooPaymentModule.getDevice(JSON.stringify(data));
  }

  const createTransaction = () => {
    let data = {"type":"SALE", "amount":"10.00", "tip":"1.00", "applicationType":"DVPAYLITE", "refId":Date.now()};
    callSaveLog({...data, requestType: 'createTransaction'});
    DejavooPaymentModule.createTransaction(JSON.stringify(data));
  }

  const goToMainPage = () => {
    navigation.navigate('startup');
  }


  return (
    <>
      <Text style={pageStyles.subTitle}>Testing the Dejavoo Integration</Text>

      <Text style={pageStyles.subTitle}>{tpn ? `Terminal Profile Number: ${tpn}` : ''}</Text>
      
      <Button style={[pageStyles.button]} mode="contained" textColor="white" onPress={getTPN}>Get Terminal TPN Number</Button>

      <Button style={[pageStyles.button]} mode="contained" textColor="white" onPress={getDevice}>Get Device</Button>

      <Button style={[pageStyles.button]} mode="contained" textColor="white" onPress={openTerminal}>Open Terminal</Button>

      <Button style={[pageStyles.button]} mode="contained" textColor="white" onPress={createTransaction}>Create Transaction</Button>

      <AlertDialog ref={dialogRef} />

      <Button style={[pageStyles.button]} mode="outlined" textColor="white" onPress={goToMainPage}>Go to Main Pages</Button>
    </>
  );
};

const pageStyles = StyleSheet.create({
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50
  },
  button: {
    height: 40,
    borderRadius: 20,
    marginTop: 10
  },
});

export default TestScreen;
