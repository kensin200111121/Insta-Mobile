import React, { useRef } from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { useLayoutContext } from '../../contexts/layout.context';
import { useMenuContext } from '../../contexts/menu.context';

import { menuIcon } from '../../../assets/svg/menu';
import AlertDialog, { AlertDialogMethod } from '../../components/AlertDialog';
const logoImage = require('../../../assets/icons/logo.png');

type HeaderProps = {
  hasMenu?: boolean;
  title?: string;
  hasTerm?: boolean;
  isCenterTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hasMenu = false, hasTerm = false, title, isCenterTitle}: HeaderProps) => {
  const { isPortrait } = useLayoutContext();
  const { toggleMenu } = hasMenu ? useMenuContext() : { toggleMenu: () => {}};
  const styles = useStyles(isPortrait);
  const alertDialogRef = useRef<AlertDialogMethod>(null);

  const openTerms = () => {
    alertDialogRef.current?.open({
      title: 'Terms of Service',
      content: `TOS COMING SOON`
    });
  }

  return (
    <View style={[styles.header, title ? styles.headerWithTitle : null]}>
      <View style={styles.logo}>
        <Image source={ logoImage } style={styles.logoIcon} />
      </View>
      {
        title ? (
          <Text style={[styles.titleText, isCenterTitle ? styles.centerTitle: styles.normalTitle ]}>{ title }</Text>
        ) : hasTerm ? (
          <TouchableOpacity style={styles.actionBtn} onPress={openTerms}>
            {/* <SvgXml xml={termIcon} /> */}
            <Text style={styles.actionBtnText}>TERMS</Text>
          </TouchableOpacity>
        ) : null
      }
      {
        hasMenu ? (
          <TouchableOpacity style={styles.menuBtn} onPress={toggleMenu}>
            <SvgXml xml={menuIcon} height={30} width={30} />
          </TouchableOpacity>
        ) : null
      }
      <View style={[styles.logo, styles.invisibleLogo]}>
        <Image source={ logoImage } style={styles.logoIcon} />
      </View>
      {
        hasTerm ? (
          <AlertDialog ref={alertDialogRef} onClose={() => {}} />
        ) : null
      }
    </View>
  );
};

const useStyles = (isPortrait: boolean) => {
  const styles = StyleSheet.create({
    header: {
      position: 'relative',
      backgroundColor: '#30260B',
      height: isPortrait ? 72 : 102,
      alignItems: isPortrait ? 'center' : 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 2
    },

    headerWithTitle: {
      justifyContent: 'flex-start',
    },

    logo: {
      alignItems: 'center',
    },

    invisibleLogo: {
      opacity: 0,
    },

    logoIcon: {
      width: isPortrait ? 40 : 60,
      height: isPortrait ? 40 : 60,
    },

    logoText: {
      fontSize: isPortrait ? 14 : 18,
      color: 'white',
      fontWeight: '700',
    },

    menuBtn: {
      position: 'absolute',
      top: isPortrait ? 21 : 36,
      right: isPortrait ? 24 : 48,
      zIndex: 1
    },

    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    actionBtnText: {
      color: 'blue',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
      marginLeft: 4,
      textDecorationLine: 'underline',
      textDecorationColor: 'blue'
    },

    titleText: {
      color: 'white',
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
    },

    centerTitle: {
      marginHorizontal: 'auto',
    },

    normalTitle: {
      marginLeft: 12
    }
  });

  return styles;
};

export default Header;
