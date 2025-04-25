import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { infoIcon } from '../../../assets/svg/info';
import { termIcon } from '../../../assets/svg/terms';
import { privacyIcon } from '../../../assets/svg/privacy';
import { useLayoutContext } from '../../contexts/layout.context';
import { useMenuContext } from '../../contexts/menu.context';

const Footer: React.FC = () => {
  const { isPortrait } = useLayoutContext();
  const { isFooterVisible } = useMenuContext();

  return (
    <View style={[styles.footer, isPortrait ? styles.phoneFooter : {}, isFooterVisible ? {} : {display: 'none'} ]}>
      <View>
        <Text style={styles.copyrightText}>
          © 2025 INSTACOIN. All rights reserved.
        </Text>
      </View>
      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <SvgXml xml={infoIcon} />
          <Text style={styles.actionBtnText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <SvgXml xml={termIcon} />
          <Text style={styles.actionBtnText}>Terms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <SvgXml xml={privacyIcon} />
          <Text style={styles.actionBtnText}>Privacy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 36,
    borderTopColor: '#BBBCBC33',
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },

  phoneFooter: {
    justifyContent: 'center',
  },

  copyrightText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: 'white',
    margin: 8,
  },

  footerActions: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
  },

  actionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
    marginLeft: 8,
  },
});

export default Footer;
