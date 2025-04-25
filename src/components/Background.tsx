/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import { useLayoutContext } from '../contexts/layout.context';
import { SvgXml } from 'react-native-svg';
import { bgImage } from '../../assets/svg/bg';


const Background = () => {
  const { width, height } = useLayoutContext();

  return (
    <SvgXml xml={bgImage(width, height - 60)} style={styles.bgImage} />
  );
};

const styles = StyleSheet.create({
  bgImage: {
    position: 'absolute',
    top: 60,
    zIndex: 0,
  },
});

export default Background;
