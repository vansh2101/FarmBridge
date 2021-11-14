import React from "react";
import { StyleSheet, View, TextInput, Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons';
import { RFPercentage } from "react-native-responsive-fontsize";


const w = Dimensions.get('screen').width


export default function InputBox({placeholder, icon, secure, keyboard, maxLength, style, iconStyle, containerStyle, value, editable, onChangeText}) {
    return(
        <View style={{...styles.container, ...containerStyle}}>
            <Feather name={icon} size={26} color="#00b975" style={{...styles.icon, ...iconStyle}} />
            <TextInput 
                placeholder={placeholder}
                style={{...styles.input, ...style}}
                secureTextEntry={secure}
                keyboardType={keyboard}
                maxLength={maxLength}
                defaultValue={value}
                editable={editable}
                onChangeText={onChangeText}
            />
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: w*0.8,
        alignItems: 'center',
        marginTop: 5,
    },

    input: {
        flex: 1,
        paddingVertical: 18,
        paddingLeft: 45,
        paddingRight: 10,
        elevation: 1,
        shadowColor: '#8c8c8c',
        color: '#00b975',
        fontSize: RFPercentage(2.4),
        overflow: 'hidden',
    },

    icon: {
        opacity: 0.7,
        position: 'absolute',
        left: 12,
        top: 19.5
    }
})