//Import modules
import { StatusBar } from "expo-status-bar";
import React, {useState} from "react";
import { StyleSheet, Text, View, Dimensions, Modal, Pressable, Image, ScrollView, Alert } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Ionicons, FontAwesome } from '@expo/vector-icons';

//firebase requirements
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Import Components
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";

//Global variables
var w = Dimensions.get('screen').width;
var h = Dimensions.get('screen').height;


//Main Function
export default function AuthScreen({navigation}){
    const [loginModal, setLoginModal] = useState(false);
    const [registerFarmerModal, setRegisterFarmerModal] = useState(false);
    const [registerExporterModal, setRegisterExporterModal] = useState(false);

    let login = {'email': '', 'pass': ''};
    let register = {
        'name': '',
        'email': '',
        'phone': '',
        'address': '',
        'pass1': '',
        'pass2': '',
    };


    const changeLogin = (param, val) => {
        login[param] = val;
    }

    const changeRegister = (param, val) => {
        register[param] = val;
    }

    const modalClose = (modal) => {
        if (modal === 'login'){
            setLoginModal(false);

            for (let x in login){login[x] = ''}

            return
        }

        if (modal === 'farmer')setRegisterFarmerModal(false)
        else if (modal === 'exporter')setRegisterExporterModal(false)

        for (let x in register){register[x] = ''}
    }

    const signin = () => {
        firebase
        .auth()
        .signInWithEmailAndPassword(login['email'], login['pass'])
        .then(() => {
            setLoginModal(false);
            navigation.navigate('Tabs');
        })
        .catch(e => {
            if (e.code === 'auth/invalid-email') Alert.alert("Email Invalid", 'Please enter a correct email')
            else if (e.code === 'auth/internal-error') Alert.alert("Password Invalid", 'Please enter a password')
            else if (e.code === 'auth/user-not-found') Alert.alert("User does not exist", 'User with entered email id does not exist')
        })
    }

    const signup = (type) => {
        const db = firebase.firestore();
        db.collection('users')
        .doc(register['email'])
        .set({
            name: register['name'],
            email: register['email'],
            phone: register['phone'],
            address: register['address'],
            type: type
        })

        firebase
        .auth()
        .createUserWithEmailAndPassword(register['email'], register['pass2'])
        .then(() => {
            if (type === 'farmer')setRegisterFarmerModal(false)
            else if (type === 'exporter')setRegisterExporterModal(false)

            login['email'] = register['email']
            login['pass'] = register['pass2']
            signin()
        })
        .catch(e => console.log(e))
    }

    return(
        <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: h*0.1}}>

            <Image source={require('../assets/leaf.png')} style={{marginBottom: 5}} />
            <Text style={styles.heading}>FarmBridge</Text>
            <Text style={{...styles.subtext, opacity: 0.5, width: w*0.8, textAlign: 'center', marginTop: 15, marginBottom: 55}}>A Bridge between Farmers and Exporters</Text>

            <Btn text='Sign In' onPress={() => setLoginModal(true)}/>
            <Btn text='Register as a Farmer' style={styles.BorderBtnStyle} textstyle={{color: '#00b975'}} onPress={() => setRegisterFarmerModal(true)} />
            <Btn text='Register as an Exporter' style={styles.BorderBtnStyle} textstyle={{color: '#00b975'}} onPress={() => setRegisterExporterModal(true)} />

            <Modal visible={loginModal} animationType='slide'>
                <View style={{padding: 10}}>
                    <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => modalClose('login')} />

                    <View style={{alignItems: 'center'}}>
                        <FontAwesome name="user-circle-o" size={120} color="black" style={{opacity: 0.05, marginTop: 20}} />

                        <Text style={{...styles.heading, fontSize: RFPercentage(5.7)}}>Sign In</Text>
                        <Text style={styles.subtext}>Login to Continue</Text>

                        <InputBox placeholder='Email' icon='mail' onChangeText={(val) => changeLogin('email', val)} />
                        <InputBox placeholder='Password' icon='lock' secure={true} onChangeText={(val) => changeLogin('pass', val)} />

                        <View style={{alignItems: 'flex-end', width: w*0.77}}>
                            <Pressable onPress={() => {console.log('forgot')}}>
                                <Text style={{color: '#00b975', fontFamily: 'poppins', fontWeight: 'bold', fontSize: RFPercentage(2.1)}}>Forgot Password?</Text>
                            </Pressable>
                        </View>

                        <Btn text='LOGIN' onPress={signin} />
                    </View>
                </View>
            </Modal>

            <Modal visible={registerFarmerModal} animationType='slide'>
                <ScrollView contentContainerStyle={{padding: 10}}>
                        <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => modalClose('farmer')} />

                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.heading}>Create Account</Text>
                            <Text style={styles.subtext}>Create a new Farmer Account</Text>

                            <InputBox placeholder='Name' icon='user' onChangeText={(val) => changeRegister('name', val)} />
                            <InputBox placeholder='Email' icon='mail' keyboard='email-address' onChangeText={(val) => changeRegister('email', val)} />
                            <InputBox placeholder='Phone No.' icon='smartphone' keyboard='numeric' maxLength={10} onChangeText={(val) => changeRegister('phone', val)} />
                            <InputBox placeholder='Address' icon='map-pin' onChangeText={(val) => changeRegister('address', val)} />
                            <InputBox placeholder='Password' icon='lock' secure={true} onChangeText={(val) => changeRegister('pass1', val)} />
                            <InputBox placeholder='Confirm Password' icon='lock' secure={true} onChangeText={(val) => changeRegister('pass2', val)} />

                            <Btn text='CREATE ACCOUNT' style={{marginTop: 30}} onPress={() => signup('farmer')}/>
                        </View>
                </ScrollView>
            </Modal>

            <Modal visible={registerExporterModal} animationType='slide'>
                <ScrollView contentContainerStyle={{padding: 10}}>
                        <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => modalClose('exporter')} />

                        <View style={{alignItems: 'center'}}>
                            <Text style={styles.heading}>Create Account</Text>
                            <Text style={styles.subtext}>Create a new Exporter Account</Text>

                            <InputBox placeholder='Organization Name' icon='user' onChangeText={(val) => changeRegister('name', val)} />
                            <InputBox placeholder='Email' icon='mail' keyboard='email-address' onChangeText={(val) => changeRegister('email', val)} />
                            <InputBox placeholder='Phone No.' icon='smartphone' keyboard='numeric' maxLength={10} onChangeText={(val) => changeRegister('phone', val)} />
                            <InputBox placeholder='Office Address' icon='map-pin' onChangeText={(val) => changeRegister('address', val)} />
                            <InputBox placeholder='Password' icon='lock' secure={true} onChangeText={(val) => changeRegister('pass1', val)} />
                            <InputBox placeholder='Confirm Password' icon='lock' secure={true} onChangeText={(val) => changeRegister('pass2', val)} />

                            <Btn text='CREATE ACCOUNT' style={{marginTop: 30}} onPress={() => signup('exporter')}/>
                        </View>
                </ScrollView>
            </Modal>

            <StatusBar style='auto' />

        </ScrollView>
    )
}


//Declaring the styles
const styles = StyleSheet.create({
    heading: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(5.2)
    },

    subtext: {
        fontFamily: 'poppins', 
        fontSize: RFPercentage(2.4), 
        marginTop: -12, 
        opacity:0.3, 
        marginLeft: 3, 
        marginBottom: 30
    },

    BorderBtnStyle: {
        backgroundColor: 'transparent', 
        borderColor: '#00b975', 
        borderWidth: 0.7, 
        marginTop: 15
    }
});