import React, { useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type AlertDialogData = {
    title?: string;
    content?: string;
    actionBtnLabel?: string;
    cancelLabel?: string;
}

export type AlertDialogMethod = {
    open: (_: AlertDialogData) => void
}

export type AlertDialogProps = {
    onClose?: (_: any) => void
}

const AlertDialog = React.forwardRef<AlertDialogMethod, AlertDialogProps>(({ onClose }, ref) => {
    useImperativeHandle(ref, () => {
        return {
            open: (_data) => {
                setData(_data);
                showDialog();
            },
        };
    }, []);

    const [visible, setVisible] = React.useState(false);
    const [data, setData] = useState<AlertDialogData>();

    const showDialog = () => setVisible(true);

    const hideDialog = () => {
        clearData();
        onClose && onClose(false);
    };

    const confirmAction = () => {
        clearData();
        onClose && onClose(true);
    };

    const clearData = () => {
        setVisible(false);
    }

    return (
        <>
            <Portal>
                <Dialog dismissable={true} visible={visible} onDismiss={hideDialog} style={styles.content}>
                    {
                        !!data?.title && <Dialog.Title style={{ color: 'black' }}>{data.title}</Dialog.Title>
                    }
                    {
                        !!data?.content && (
                            <Dialog.Content>
                                <Text variant="bodyMedium" style={{ color: 'black' }}>{data.content}</Text>
                            </Dialog.Content>
                        )
                    }
                    <Dialog.Actions style={{ justifyContent: 'center' }}>
                        <Button mode="contained" style={{ width: 80, backgroundColor: '#F7C41E' }}
                            textColor="white" onPress={hideDialog}>{data?.cancelLabel || 'OK'}</Button>
                        {
                            data?.actionBtnLabel ? <Button mode="contained" style={{ width: 80, backgroundColor: '#30260B' }}
                            textColor="white" onPress={confirmAction}>{data.actionBtnLabel}</Button> : null
                        }
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
});

const styles = StyleSheet.create({
    content: {
        borderRadius: 16,
        // backgroundColor: '#30260B',
    },
})

export default AlertDialog;
