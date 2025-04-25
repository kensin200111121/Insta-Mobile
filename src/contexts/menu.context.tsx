import React, {PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import { Dimensions } from 'react-native';
import { useAuthContext } from './auth.context';

const { width, height } = Dimensions.get('window');

export type MenuItem = {
  id: string | number,
  icon: string,
  title: string,
  action: string | (() => void),
}

type MenuContextType = {
  isMenuVisible: boolean,
  toggleMenu: () => void,
  showMenu: () => void,
  hideMenu: () => void,
  menuData: MenuItem[]
};

export const MenuContext = React.createContext<MenuContextType | undefined>(
  undefined,
);

export const MenuProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {

  const { updateStoreInfo, updateStoreToken, userToken, updateUserToken, hasOverlay } = useAuthContext();
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const defaultMenuItems = useMemo(() => {
    return [
      {
        id: 'startup',
        icon: 'transaction',
        title: 'Home',
        action: () => {
          if (userToken) {
            updateUserToken('');
          } else {
            toggleMenu();
          }
        },
      },
      {
        id: 'transaction',
        icon: 'transaction',
        title: 'Transactions',
        action: 'transaction',
      },{
        id: 'refund',
        icon: 'refund',
        title: 'Refunds',
        action: 'refund',
      },{
        id: 'setting',
        icon: 'setting',
        title: 'Setting',
        action: 'setting',
      }
    ]
  }, [userToken])

  const toggleMenu = () => setIsMenuVisible(prev => !prev);
  const showMenu = () => setIsMenuVisible(true);
  const hideMenu = () => setIsMenuVisible(false);

  return (
    <MenuContext.Provider value={{ isMenuVisible,
      toggleMenu,
      showMenu,
      hideMenu,
      menuData: defaultMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = (): MenuContextType => {
  const ctx = useContext(MenuContext);

  if (!ctx) {
    throw new Error();
  }

  return ctx;
};
