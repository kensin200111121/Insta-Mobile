import React, { useImperativeHandle, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import NumericPad from 'react-native-numeric-pad';
import { generateNumberPadProps } from '../../constants/numpad';
import { NumpadRef } from '../../interface/numberpad';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../../assets/svg/close';
import styles from './style';


export type CustomTipDialogMethod = {
    open: () => void
}

export type CustomTipDialogProps = {
    onClose: (_: any) => void
}

const CustomTipDialog = React.forwardRef<CustomTipDialogMethod, CustomTipDialogProps>(({ onClose }, ref) => {
    useImperativeHandle(ref, () => {
        return {
            open: () => {
                showDialog();
            },
        };
    }, []);

    const [visible, setVisible] = React.useState(false);
    const [amount, setAmount] = useState('');
    const numpadRef = useRef<NumpadRef>(null)

    const showDialog = () => setVisible(true);

    const hideDialog = () => {
        clearData();
        onClose(parseFloat(amount));
    };

    const clearData = () => {
        setAmount('');
        setVisible(false);
    }

    const closeDialog = () => {
        clearData();
        onClose(0);
    }

    return (
        <>
            <Portal>
                <Dialog dismissable={true} visible={visible} onDismiss={closeDialog} style={{ borderRadius: 16, backgroundColor: '#30260B' }}>
                    <Dialog.Content style={{paddingBottom: 0}}>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={closeDialog}>
                            <SvgXml xml={closeIcon} width={24} height={24} />
                        </TouchableOpacity>
                        <TextInput
                            mode="outlined"
                            outlineColor="white"
                            activeOutlineColor="white"
                            placeholder="Enter Tip Amount"
                            showSoftInputOnFocus={false}
                            autoFocus={true}
                            editable={false}
                            value={'$' + amount}
                            numberOfLines={1}
                            style={{ height: 60, fontSize: 24, textAlign: 'center', marginHorizontal: 8, marginVertical: 15}}
                        />
                        <NumericPad
                            ref={numpadRef}
                            numLength={8}
                            onValueChange={value => setAmount(value)}
                            allowDecimal={true}
                            onRightBottomButtonPress={() => {numpadRef.current?.clear()}}
                            {...generateNumberPadProps(200)}
                            style={{marginBottom: 0}}
                        />
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: 'center' }}>
                        <Button mode="contained" style={styles.button} labelStyle={styles.buttonLabel}
                            textColor="white" onPress={hideDialog}>Add Tip</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
});

export default CustomTipDialog;
