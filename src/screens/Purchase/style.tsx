import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#050505',
      width: '100%',
      flex: 1,
      justifyContent: 'center'
    },
    headerText: {
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 36,
    },
    buttonText: {
      fontSize: 12,
      textDecorationLine: 'underline',
      lineHeight: 20,
    },
    button: {
      width: '100%',
      marginTop: 16,
      height: 60,
      justifyContent: 'center',
      borderRadius: 30,
    },
    buttonLabel: {
      fontSize: 20,
    },
  });

export default styles;
