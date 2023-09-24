import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { CLEAR, keys, ENTER} from '../config/constants'
import styles, { keyWidth } from './Keyboard.styles';

function Keyboard({
    onKeyPressed = () => {},
    greenCaps = [],
    yellowCaps = [],
    greyCaps = [],
}) {
    const isLongButton = (key) => {
        return key === ENTER || key === CLEAR;
    };

    const getKeyBGColor = (key) => {
        if (greenCaps.includes(key))
            return 'green';
        if (yellowCaps.includes(key))
            return 'yellow';
        if (greyCaps.includes(key))
            return 'grey';
        return 'lightgrey'
    };

   return (
        <View style={styles.keyboard}>
            {keys.map((keyRow, i) => (
                <View style={styles.row} key={`row-${i}`}>
                    {keyRow.map((key) => (
                        <Pressable 
                            onPress={() => onKeyPressed(key)}
                            key={key}
                            style={[
                                styles.key,
                                isLongButton(key) ? { width: keyWidth * 1.4 } : {},
                                { backgroundColor: getKeyBGColor(key) },
                            ]}    
                        >
                            <Text style={styles.keyText}>{key.toUpperCase()}</Text>
                        </Pressable>
                    ))}
                </View>
            ))}
        </View>
   );
}

export default Keyboard;