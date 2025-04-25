import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type LayoutContextType = {
  isPortrait: boolean;
  width: number,
  height: number
};

export const LayoutContext = React.createContext<LayoutContextType | undefined>(
  undefined,
);

export const LayoutProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const [info, setInfo] = useState<LayoutContextType>({
    isPortrait: width > height ? false : true,
    width,
    height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      const { width: _width, height: _height } = window;
      const _isPortrait = _width < _height;
      setInfo({
        isPortrait: _isPortrait,
        width: _width,
        height: _height,
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <LayoutContext.Provider value={{ ...info }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextType => {
  const ctx = useContext(LayoutContext);

  if (!ctx) {
    throw new Error();
  }

  return ctx;
};
