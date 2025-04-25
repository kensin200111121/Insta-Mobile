import React, {useRef, useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { MenuItem, useMenuContext } from '../contexts/menu.context';
import { useLayoutContext } from '../contexts/layout.context';
import { SvgXml } from 'react-native-svg';
import { transactionIcon } from '../../assets/svg/transaction';
import { refundIcon } from '../../assets/svg/refund';
import { settingIcon } from '../../assets/svg/setting';
import { logoutIcon } from '../../assets/svg/logout';
import { createNavigationContainerRef } from "@react-navigation/native";

const MenuIcon = (id: string) => {
  switch(id){
    case 'transaction':
      return transactionIcon;
    case 'refund':
      return refundIcon;
    case 'setting':
      return settingIcon;
    case 'logout':
      return logoutIcon;
  }
  return '';
}

const NavMenu = () => {
  const { isPortrait, height } = useLayoutContext();
  const styles = useStyles(isPortrait);
  const { isMenuVisible, menuData, hideMenu } = useMenuContext();
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial position off-screen
  const [currentMenu, setCurrentMenu] = useState('');
  const [padding, setPadding] = useState(0);

  React.useEffect(() => {
    if(isMenuVisible){
      setPadding(9);
    }
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? height : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => !isMenuVisible && setPadding(0));
  }, [isMenuVisible]);

  const handleMenuClick = (item: MenuItem) => {
    setCurrentMenu(item.id.toString());
    if(typeof item.action === 'string'){
      if (navigationRef.isReady()) {
        navigationRef.navigate(item.action);
      }
    }else{
      item.action();
    }
    hideMenu();
  }

  const renderItem = ({item} : any) => (
    <TouchableOpacity
      style={[styles.menuItem, item.id === currentMenu ? styles.menuItemSelected : {}]}
      onPress={() => handleMenuClick(item)}
    >
      <View style={{width: 25}}><SvgXml xml={MenuIcon(item.icon)} /></View>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.menuContainer, { height: slideAnim }]}>
      <View style={[styles.backgroud, {paddingTop: padding}]}>
        <FlatList
          data={menuData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </Animated.View>
  );
};

const useStyles = (isPortrait: boolean) => {
  const styles = StyleSheet.create({
    menuContainer: {
      position: 'absolute',
      top: isPortrait ? 72 : 102,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      zIndex: 1,
    },
    backgroud: {
      paddingHorizontal: 12,
      flex: 1,
      backgroundColor: '#30260B9E',
    },
    menuItem: {
      padding: 15,
      paddingLeft: 40,
      flex: 1,
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center'
    },
    menuItemSelected: {
      backgroundColor: '#30260B',
    },
    menuText: {
      fontSize: 20,
      color: 'white',
      fontFamily: 'Poppins',
      fontWeight: '500',
      lineHeight: 32
    }
  });

  return styles;
};

export default NavMenu;

export const navigationRef = createNavigationContainerRef();
