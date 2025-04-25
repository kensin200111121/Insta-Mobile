import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';

export type DialogContentProps<T, U> = {
  data: T,
  onClose: (_?: U) => void,
  hide: () => void
}

export type DialogMethod<T> = {
  open: (_: T) => void
}

type DialogProps<U> = {
  title?: string,
  onClose?: (_?: U) => void,
}

function withDialog<T extends {}, U extends {}>( ContentComponent: React.FC<DialogContentProps<T, U>> ) {

  const DialogWithContent = React.forwardRef<DialogMethod<T>, DialogProps<U>>(
    ({ onClose, title }, ref) => {

      const [isOpened, setIsOpened] = useState(false);
      const [data, setData] = useState<T>();

      useImperativeHandle(ref, () => {
        return {
          open: (_data: T) => {
            setData(_data);
            setIsOpened(true);
          },
        };
      }, []);

      const close = (data?: U) => {
        hideDialog();
        if(onClose){
          onClose(data);
        }
      }

      const hideDialog = () => setIsOpened(false);

      return (
        <Portal>
          <Dialog dismissable visible={isOpened} onDismiss={hideDialog} style={styles.container}>
            {
              !!title && <Dialog.Title style={styles.title}>{title}</Dialog.Title>
            }
            {
              data && (
                <Dialog.Content style={styles.content}>
                  <ContentComponent data={data} onClose={close} hide={hideDialog} />
                </Dialog.Content>
              )
            }
          </Dialog>
        </Portal>
      )
    }
  )

  return DialogWithContent;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  content: {
    paddingBottom: 15,
    paddingHorizontal: 15
  },
})

export default withDialog;