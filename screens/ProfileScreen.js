//Import modules
import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

//Import Firebase requirements
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Import Components
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";


//Global variables
var w = Dimensions.get('screen').width;
var h = Dimensions.get('screen').height;


//main function
export default function ProfileScreen({navigation}){
    const [loading, setLoading] = useState(true)
    const [editModal, setEditModal] = useState(false)
    const [user, setUser] = useState({})

    const [pending,setPending] = useState(0);
    const [done,setDone] = useState(0)

    let details = {
        'name': user.name,
        'phone': user.phone,
        'address': user.address,
    }

    const db = firebase.firestore();

    const getUser = async () => {
        const info = await db.collection('users').doc(firebase.auth().currentUser.email).get()
        setUser(info.data())
    }

    useEffect(() => {
        (
            async () => {
                getUser()

                setDone(0)
                setPending(0)
                const info = await db.collection('users').doc(firebase.auth().currentUser.email).collection('orders').get()
                info.forEach((doc) => {
                    if(doc.data().status === 'pending')setPending(pending+1)
                    else if(doc.data().status === 'done')setDone(done+1)
                })

                setLoading(false)
            }
        )();
    }, [])

    const changeDetails = (param, val) => {
        details[param] = val;
    }

    const updateDetails = () => {
        if (details['name'] !== user.name){
            db.collection('users').doc(user.email).update({name: details['name']});
        }

        if (details['phone'] !== user.phone){
            db.collection('users').doc(user.email).update({phone: details['phone']});
        }

        if (details['address'] !== user.address){
            db.collection('users').doc(user.email).update({address: details['address']});
        }

        setEditModal(false)

        getUser()
    }

    const logout = () => {
        firebase.auth().signOut();
        navigation.navigate('AuthScreen')
    }

    if (loading){
        return(
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#00b975" />
            </View>
        )
    }
    else{
        return(
            <ScrollView contentContainerStyle={styles.screen}>
                <View style={styles.topCircle}></View>

                <FontAwesome name="user-circle-o" size={130} color="black" style={{opacity: 0.3, marginTop: h*0.07}} />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.details}>{user.email}</Text>

                <View style={{alignItems: 'flex-start', width: w*0.9, marginTop: h*0.03}}>
                    <Text style={styles.heading}>Order Summary</Text>

                    <View style={{flexDirection: 'row', marginTop: 5,width: w*0.92, justifyContent: 'space-evenly'}}>
                        <View style={styles.box}>
                            <Text style={styles.boxNum}>{pending+done}</Text>
                            <Text style={styles.boxText}>Total Order</Text>
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.boxNum}>{done}</Text>
                            <Text style={styles.boxText}>Delivered</Text>
                        </View>

                        <View style={styles.box}>
                            <Text style={styles.boxNum}>{pending}</Text>
                            <Text style={styles.boxText}>Pending</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <TouchableOpacity style={{...styles.btn, marginTop: h*0.05}} onPress={() => setEditModal(true)}>
                        <View style={styles.btnContainer}>
                            <MaterialCommunityIcons name="account-edit-outline" size={35} color="black" style={{marginHorizontal: 5}} />
                            <Text style={styles.btnText}>Edit Profile</Text>
                            <MaterialCommunityIcons name="chevron-right" size={30} color="black" style={styles.btnRightIcon} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Pending')}>
                        <View style={styles.btnContainer}>
                            <MaterialCommunityIcons name="file-document-outline" size={35} color="black" style={{marginHorizontal: 5}} />
                            <Text style={styles.btnText}>Pending Orders</Text>
                            <MaterialCommunityIcons name="chevron-right" size={30} color="black" style={styles.btnRightIcon} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('My Orders')}>
                        <View style={styles.btnContainer}>
                            <MaterialCommunityIcons name="cart-outline" size={35} color="black" style={{marginHorizontal: 5}} />
                            <Text style={styles.btnText}>Completed Orders</Text>
                            <MaterialCommunityIcons name="chevron-right" size={30} color="black" style={styles.btnRightIcon} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={logout}>
                        <View style={styles.btnContainer}>
                            <MaterialCommunityIcons name="power" size={35} color="red" style={{marginHorizontal: 5}} />
                            <Text style={{...styles.btnText, color: 'red'}}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Modal statusBarTranslucent={true} visible={editModal} animationType='slide'>
                    <View style={{padding: 10, paddingTop: StatusBar.currentHeight+10}}>
                        <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => setEditModal(false)} />

                        <View style={{alignItems: 'center', paddingTop: 50}}>

                            <Text style={{...styles.heading, fontSize: RFPercentage(5.7)}}>Edit Profile</Text>
                            <Text style={{...styles.details, marginTop: -15, fontSize: RFPercentage(2.2), marginBottom: 35}}>Edit your details</Text>

                            <InputBox value={details.name} icon='user' containerStyle={{width: w*0.9}} onChangeText={val => changeDetails('name', val)} />
                            <InputBox value={user.email} icon='mail' editable={false} containerStyle={{opacity: 0.5, width: w*0.9}} />
                            <InputBox value={details.phone} icon='smartphone' keyboard='numeric' containerStyle={{width: w*0.9}} onChangeText={val => changeDetails('phone', val)} />
                            <InputBox value={details.address} icon='map-pin' containerStyle={{width: w*0.9}} onChangeText={val => changeDetails('address', val)} />

                            <Btn text='SAVE CHANGES' onPress={updateDetails} />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}


//styles
const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
    },

    topCircle: {
        backgroundColor: 'rgba(0, 185, 117, 0.55)',
        width: 1300,
        height: 1100,
        borderRadius: 550,
        position: 'absolute',
        top: -735
    },

    name: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(3.8),
        lineHeight: 37
    },

    details: {
        fontFamily: 'poppins',
        opacity: 0.5,
        lineHeight: 22,
        fontSize: RFPercentage(2.1)
    },

    heading: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(2.5),
    },

    box: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        width: w*0.28,
    },

    boxNum: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(2.8),
        lineHeight: 25
    },

    boxText: {
        fontFamily: 'poppins',
        opacity: 0.5,
        fontSize: RFPercentage(2)
    },

    btn: {
        width: w*0.95,
        marginTop: 7
    },

    btnContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 7
    },

    btnText: {
        fontFamily: 'poppins',
        fontSize: RFPercentage(2.7),
        fontWeight: 'bold',
        marginTop: 5,
        marginHorizontal: 7
    },

    btnRightIcon: {
        position: 'absolute',
        right: 2,
        top: 9,
        opacity: 0.4
    }
})