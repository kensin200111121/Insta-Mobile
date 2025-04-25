import { SvgXml } from "react-native-svg";
import { backspaceIcon } from "../../assets/svg/backspace";
import { Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');
let keyBoardHeight = Math.floor((height - 380) / 4);
keyBoardHeight = (keyBoardHeight > 72) ? 72 : (keyBoardHeight < 60) ? 60 : keyBoardHeight;

export const numpadProps = {
    activeOpacity: 0.1,
    style: { backgroundColor: 'transparent', padding: 6 },
    buttonAreaStyle: { backgroundColor: 'transparent', width: 300 },
    buttonItemStyle: { borderColor: 'white', borderWidth: 0, width: keyBoardHeight, height: keyBoardHeight, borderRadius: keyBoardHeight / 2, backgroundColor: '#F7C41EBD' },
    buttonTextStyle: { color: 'white', fontWeight: '400', fontSize: 26, },
    rightBottomButtonItemStyle: { borderColor: 'transparent', width: keyBoardHeight, height: keyBoardHeight, borderRadius: keyBoardHeight / 2, },
    rightBottomButton: <SvgXml xml={backspaceIcon} />
}

export const generateNumberPadProps = (contentHeight: number, color = '#F7C41EBD', textColor = 'white') => {
    const keyBoardHeight = height - 72 - 24 - 48 - contentHeight; // header, container padding, keyboard margin bottoms
    const keyBoardWith = width - 24 - 48; // container padding, keyboard margin horizontal

    const wSize = Math.floor(keyBoardWith / 3);
    const hSize = Math.floor(keyBoardHeight / 4);
    const keyBoardSize = Math.min(wSize, hSize);

    return {
        activeOpacity: 0.1,
        style: { backgroundColor: 'transparent', padding: 0 },
        buttonAreaStyle: { backgroundColor: 'transparent', width: '100%' },
        buttonItemStyle: { borderColor: 'white', borderWidth: 0, width: keyBoardSize, height: keyBoardSize, borderRadius: keyBoardSize / 2, backgroundColor: color },
        buttonTextStyle: { color: textColor, fontWeight: '400', fontSize: 26, },
        rightBottomButtonItemStyle: { borderColor: 'transparent', width: keyBoardSize, height: keyBoardSize, borderRadius: keyBoardSize / 2, },
        rightBottomButton: <SvgXml xml={backspaceIcon} />
    }
}