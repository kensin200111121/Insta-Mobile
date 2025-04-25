import React from "react";
import { Text, StyleSheet } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

interface GradientMarkProps {
  type: number;
}

const GradientMark: React.FC<GradientMarkProps> = ({ type }) => {

  const labels = ['DB', 'CR', 'TX', 'RE', 'CB'];
  const colors = ['#0000FF', '#FFFF00', '#FFFF00', '#FF0000', '#FFC0CB'];

  return (
    <LinearGradient 
      colors={[colors[type], '#808080']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.text}>{labels[type]}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white'
  }
});

export default GradientMark;
