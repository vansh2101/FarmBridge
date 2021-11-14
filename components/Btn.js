import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";


export default function Btn({text, onPress, style, textstyle}){
    return(
        <TouchableOpacity onPress={onPress}>
            <View style={{...styles.btn, ...style}}>
                <Text style={{...styles.btnText, ...textstyle}}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    btn: {
        width: Dimensions.get('screen').width * 0.775,
        backgroundColor: '#00b975',
        padding: 6,
        marginTop: 50,
        marginLeft: -1,
        alignItems: 'center',
        borderRadius: 5
    },

    btnText: {
        fontFamily: 'poppins',
        color: 'white',
        fontSize: RFPercentage(3),
        marginTop: 4
    }
})