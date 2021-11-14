//Import modules
import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar, Image, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

//Import Firebase requirements
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


//Global variables
var w = Dimensions.get('screen').width;
var h = Dimensions.get('screen').height;


//main function
export default function OrderScreen(){
    const [loading, setLoading] = useState(true)
    const [pending, setPending] = useState([])
    const [user, setUser] = useState({})

    const db = firebase.firestore()

    const getPending = async () => {
        const obj = await db.collection('users').doc(firebase.auth().currentUser.email).collection('orders').get()
        setPending([])
        obj.forEach(doc => {
            if (doc.data().status === 'pending')setPending(current => {return [doc.data(), ...current]})
        })
    }

    useEffect(() => {
        (
            async () => {
                const info = await db.collection('users').doc(firebase.auth().currentUser.email).get()
                setUser(info.data())

                getPending()

                setLoading(false)
            }
        )()
    }, [])


    const update = async (item) => {
        const query = await db.collection('users').doc(user.email).collection('orders').get()
        query.forEach(doc => {
            if (doc.data().item == item.item && doc.data().exporter == item.exporter){
                db.collection('users').doc(user.email).collection('orders').doc(doc.id).update({'status': 'done'})
            }
        })

        const query2 = await db.collection('users').doc(item.exporter).collection('orders').get()
        query2.forEach(doc => {
            if (doc.data().item == item.item && doc.data().farmer == user.email){
                db.collection('users').doc(item.exporter).collection('orders').doc(doc.id).update({'status': 'done'})
            }
        })

        getPending()
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
                <Text style={styles.heading}>Orders Pending</Text>

                <View style={{alignItems: 'center', marginTop: 15}}>

                    {pending.map((item) => {
                        return(
                            <View>
                                <View style={styles.container}>
                                {item.item.toLowerCase() === 'onions' ? 
                                <Image source={require('../assets/images/onion.png')} style={{width: 100, height: 100}} />
                                : item.item.toLowerCase() === 'mushroom' ?
                                <Image source={require('../assets/images/mushroom.png')} style={{width: 100, height: 100}}/>
                                : item.item.toLowerCase() === 'tomato' ?
                                <Image source={require('../assets/images/tomato.png')} style={{width: 100, height: 100}}/>
                                : item.item.toLowerCase() === 'potato' ?
                                <Image source={require('../assets/images/potato.png')} style={{width: 100, height: 100}}/>
                                : null
                                }

                                    <View style={{marginLeft: 5}}>
                                        <Text style={styles.item}>{item.item}</Text>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.price}>₹{item.price} <Text style={styles.subPrice}>per kg</Text></Text>
                                    </View>

                                    <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 10}}>
                                        {user.type === 'exporter' ?
                                            <Feather name="clock" size={34} color="#00b975" style={{textAlignVertical: 'center'}} />
                                        :
                                            <Pressable onPress={() => update(item)}>
                                                <MaterialCommunityIcons name="clock-check-outline" size={34} color="#00b975" style={{marginTop: 25}} />
                                            </Pressable>
                                        }
                                    </View>
                                </View>

                                <View style={styles.line}></View>
                            </View>
                        )
                    })}

                </View>
            </ScrollView>
        )
    }
}


//styles
const styles = StyleSheet.create({
    screen: {
        paddingTop: StatusBar.currentHeight
    },

    heading: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(5),
        marginTop: 15,
        marginLeft: 15
    },

    item: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(3.4),
    },

    name: {
        fontFamily: 'poppins',
        fontSize: RFPercentage(2.3),
        opacity: 0.5,
        marginTop: -10
    },

    price: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(2.9)
    },

    subPrice: {
        fontFamily: 'poppins',
        fontSize: RFPercentage(2.7),
    },

    container: {
        flexDirection: 'row',
        width: w*0.95,
    },

    line: {
        borderWidth: 0.5,
        width: w*0.6,
        borderColor: 'lightgray',
        marginBottom: 15,
        alignSelf: 'center'
    }
})