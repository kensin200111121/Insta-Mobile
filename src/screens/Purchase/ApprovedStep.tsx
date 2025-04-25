import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Text, Button } from 'react-native-paper';
import styles from './style';
import { StepComponentProps } from './type';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/auth.context';
import { formatDisplayNumber } from '../../utils/format';

const ApprovedStep: React.FC<StepComponentProps> = ({ data }) => {
  const navigation = useNavigation();
  const { updateUserToken } = useAuthContext();

  const onComplete = () => {
    updateUserToken('');
  };

  return (
    <>
      <Text style={styles.headerText}>Credits Applied!</Text>
      <Text style={pageStyles.subTitle}>Thank you for your purchase</Text>
      <View style={pageStyles.infoList}>
        <View style={pageStyles.info}>
          <Text style={pageStyles.infoTitle}>Amount</Text>
          {/* <Text style={pageStyles.infoValue}>$ 50</Text> */}
          <Text style={pageStyles.infoValue}>$ {formatDisplayNumber((data?.totalAmount || 0) + '')}</Text>
        </View>
        <View style={pageStyles.info}>
          <Text style={pageStyles.infoTitle}>Transaction ID</Text>
          {/* <Text style={pageStyles.infoValue}>xxxx xxxx xxxx 4242</Text> */}
          <Text style={pageStyles.infoValue}>xxxx xxxx xxxx {(data?.transaction?.transaction_id || '').slice(-4)}</Text>
        </View>
      </View>
      <Button style={[styles.button, pageStyles.button]} labelStyle={[styles.buttonLabel, pageStyles.buttonLabel]} mode="contained" textColor="white" onPress={onComplete}>Done</Button>
    </>
  );
};

const pageStyles = StyleSheet.create({
  subTitle: {
    fontSize: 18,
  },
  infoList: {
    marginVertical: 50,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
    alignItems: 'center'
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 20,
  },
  button: {
    height: 100,
    borderRadius: 20,
    padding: 0
  },
  buttonLabel: {
    fontSize: 28,
    lineHeight: 28,
    padding: 0
  },
});

export default ApprovedStep;
