import React, {PropsWithChildren, useContext, useEffect, useRef, useState} from 'react';
import { Dimensions } from 'react-native';
import { Snackbar } from 'react-native-paper';
import AlertDialog, { AlertDialogMethod } from '../components/AlertDialog';

const { width, height } = Dimensions.get('window');

type LayoutContextInfo = {
  isPortrait: boolean;
  width: number,
  height: number,
}

type LayoutContextType = {
  isPortrait: boolean;
  width: number,
  height: number,
  showError: (_: string, __: string) => void
};

export const LayoutContext = React.createContext<LayoutContextType | undefined>(
  undefined,
);

export const LayoutProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const [info, setInfo] = useState<LayoutContextInfo>({
    isPortrait: width > height ? false : true,
    width,
    height,
  });
  const alertDialogRef = useRef<AlertDialogMethod>(null);
  const showError = (title: string, msg: string) => {
    alertDialogRef.current?.open({ title, content: msg });
  }

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
    <LayoutContext.Provider value={{ ...info, showError }}>
      {children}
      <AlertDialog ref={alertDialogRef} onClose={() => {}} />
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
