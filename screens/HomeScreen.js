//Import modules
import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView, StatusBar, Pressable, Image, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';

//Import Firebase requirements
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Import components
import InputBox from "../components/InputBox";
import Btn from "../components/Btn";


//Global variables
var w = Dimensions.get('screen').width;
var h = Dimensions.get('screen').height;

var colors = ['#ffebec', '#edf0ff', '#feebf1', '#f3f9eb'];


//main function
export default function HomeScreen(){
    const [loading, setLoading] = useState(true)
    const [addModal, setAddModal] = useState(false)
    const [itemModal, setItemModal] = useState(false)
    const [user, setUser] = useState({})
    const [items, setItems] = useState([])
    const [showItem, setShowItem] = useState({
        'name': '',
    })

    let crop = {
        'name': '',
        'description': '',
        'price': ''
    }

    const db = firebase.firestore();

    const getItems = async () => {
        const obj = await db.collection('items').get()
        setItems([])
        obj.forEach(doc => setItems(current => {
            return [doc.data(), ...current]
        }))
    }

    useEffect(() => {
        (
            async () => {
                const info = await db.collection('users').doc(firebase.auth().currentUser.email).get()
                setUser(info.data())

                getItems()

                setLoading(false)
            }
        )();
    }, [])

    const changeCrop = (param, val) => {
        crop[param] = val
    }

    const addCrop = () => {
        const item = crop
        item['owner'] = user.email
        item['farmer'] = user.name
        item['phone'] = user.phone
        item['address'] = user.address
        db.collection('items').add(item)
        setAddModal(false)

        getItems()

        for (let x in crop) crop[x] = ''
    }

    const deletePost = (item) => {
        db.collection('items').where('name', '==', item.name).get()
        .then((qs) => {
            qs.forEach((doc) => {
                console.log(doc.id, "=>", doc.data())
            })
        })
    }

    const orderCrop = (item) => {
        db.collection('users').doc(user.email).collection('orders').add({
            'item': item.name,
            'farmer': item.owner,
            'price': item.price,
            'name': item.farmer,
            'status': 'pending'
        })

        db.collection('users').doc(item.owner).collection('orders').add({
            'item': item.name,
            'exporter': user.email,
            'price': item.price,
            'name': user.name,
            'status': 'pending'
        })

        setItemModal(false)
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
                <View style={{padding: 20, position: 'relative'}}>
                    <Text style={styles.subtext}>Welcome</Text>
                    <Text style={styles.heading}>{user.name}</Text>

                    {user.type === 'farmer' ?
                        <Pressable style={{position: 'absolute', top: 35, right: 20}} onPress={() => setAddModal(true)}>
                            <FontAwesome5 name="plus" size={30} color="#00b975" />
                        </Pressable>
                    : 
                        <Pressable style={{position: 'absolute', top: 35, right: 20}} onPress={() => console.log('notifications')}>
                            <FontAwesome5 name="bell" size={30} color="#00b975" />
                        </Pressable>
                    }
                </View>

                <View style={{alignItems: 'center'}}>
                    <View style={styles.searchContainer}>
                        <Text style={{...styles.heading, textAlign: 'center', width: w*0.7}}>What would you like to buy?</Text>

                        <InputBox icon='search' placeholder='Search Grocery...' style={{elevation: 0}} containerStyle={{backgroundColor: 'white', borderRadius: 30, width: w*0.75, height: 55}} iconStyle={{top: 13.5}} />
                    </View>
                </View>

                <View style={styles.container}>
                    {items.map((item) => {
                        return(
                            <TouchableOpacity onPress={() => {
                                setShowItem(item);
                                setItemModal(true)
                            }}>
                                <View style={{...styles.box, backgroundColor: colors[Math.floor(Math.random() * colors.length)]}}>
                                    {item.name.toLowerCase() === 'onions' ? 
                                    <Image source={require('../assets/images/onion.png')} style={{width: 100, height: 100}} />
                                    : item.name.toLowerCase() === 'mushroom' ?
                                    <Image source={require('../assets/images/mushroom.png')} style={{width: 100, height: 100}}/>
                                    : item.name.toLowerCase() === 'tomato' ?
                                    <Image source={require('../assets/images/tomato.png')} style={{width: 100, height: 100}}/>
                                    : item.name.toLowerCase() === 'potato' ?
                                    <Image source={require('../assets/images/potato.png')} style={{width: 100, height: 100}}/>
                                    : null
                                    }
                                    <Text style={{...styles.heading, fontSize: RFPercentage(3.2)}}>{item.name}</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{...styles.subtext, fontSize: RFPercentage(2.6), opacity: 1, fontWeight: 'bold'}}>₹{item.price} </Text>
                                        <Text style={{...styles.subtext, fontSize: RFPercentage(2.5)}}>per kg</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Modal statusBarTranslucent={true} visible={addModal} animationType='slide'>
                    <View style={{padding: 10, paddingTop: StatusBar.currentHeight+10}}>
                        <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => setAddModal(false)} />

                        <View style={{alignItems: 'center', paddingTop: 50}}>

                            <Text style={{...styles.heading, fontSize: RFPercentage(5.7)}}>Add Crop</Text>
                            <Text style={{...styles.details, marginTop: -15, fontSize: RFPercentage(2.2), marginBottom: 35}}>Post a new crop</Text>

                            <InputBox icon='tag' placeholder='Crop Name' containerStyle={{width: w*0.9}} onChangeText={val => changeCrop('name', val)} />
                            <InputBox icon='type' placeholder='Description' containerStyle={{width: w*0.9}} onChangeText={val => changeCrop('description', val)} />
                            <InputBox icon='dollar-sign' placeholder='Price per kg' keyboard='numeric' containerStyle={{width: w*0.9}} onChangeText={val => changeCrop('price', val)} />

                            <Btn text='ADD CROP' onPress={addCrop} />
                        </View>
                    </View>
                </Modal>

                <Modal statusBarTranslucent={true} visible={itemModal} animationType='slide'>
                    <View style={{padding: 10, paddingTop: StatusBar.currentHeight+10, flex: 1, position: 'relative'}}>
                        <Ionicons name="arrow-back" size={38} color="#00b975" onPress={() => setItemModal(false)} />

                        <View style={{alignItems: 'center'}}>
                        {showItem.name.toLowerCase() === 'onions' ? 
                        <Image source={require('../assets/images/onion.png')} style={{width: 300, height: 300}} />
                        : showItem.name.toLowerCase() === 'mushroom' ?
                        <Image source={require('../assets/images/mushroom.png')} style={{width: 300, height: 300}}/>
                        : showItem.name.toLowerCase() === 'tomato' ?
                        <Image source={require('../assets/images/tomato.png')} style={{width: 300, height: 300}}/>
                        : showItem.name.toLowerCase() === 'potato' ?
                        <Image source={require('../assets/images/potato.png')} style={{width: 300, height: 300}}/>
                        : null
                        }
                        </View>

                        <View style={{paddingHorizontal: 10, marginTop: -25, height: h*0.4}}>
                            <ScrollView>
                                <Text style={{...styles.heading, fontSize: RFPercentage(6)}}>{showItem.name}</Text>

                                <View style={{flexDirection: 'row', marginTop: -15, marginLeft: 5}}>
                                    <Text style={{...styles.subtext, fontSize: RFPercentage(3.7), opacity: 1, fontWeight: 'bold'}}>₹{showItem.price} </Text>
                                    <Text style={{...styles.subtext, fontSize: RFPercentage(3.2)}}>per kg</Text>
                                </View>

                                <View style={{marginTop: 15}}>
                                    <Text style={{...styles.heading, fontSize: RFPercentage(2.8), opacity: 0.7}}>Description</Text>
                                    <Text style={{...styles.details, fontSize: RFPercentage(2.4)}}>{showItem.description}</Text>
                                </View>

                                <View style={{marginTop: 20}}>
                                    <Text style={{...styles.heading, fontSize: RFPercentage(2.8), opacity: 0.7}}>Farmer Details</Text>

                                    <View style={{flexDirection: 'row'}}>
                                        <Feather name="user" size={21} color="black" style={{opacity: 0.5}} />
                                        <Text style={{...styles.details, fontSize: RFPercentage(2.4), marginLeft: 3}}>{showItem.farmer}</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <Feather name="phone" size={21} color="black" style={{opacity: 0.5}} />
                                        <Text style={{...styles.details, fontSize: RFPercentage(2.4), marginLeft: 3}}>{showItem.phone}</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <Feather name="mail" size={21} color="black" style={{opacity: 0.5}} />
                                        <Text style={{...styles.details, fontSize: RFPercentage(2.4), marginLeft: 3}}>{showItem.owner}</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <Feather name="map-pin" size={21} color="black" style={{opacity: 0.5}} />
                                        <Text style={{...styles.details, fontSize: RFPercentage(2.4), marginLeft: 3}}>{showItem.address}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                        {user.type === 'exporter' ?
                            <Btn text='ORDER CROP' style={{marginTop: 10, alignSelf: 'center'}} onPress={() => orderCrop(showItem)} />
                        :
                            <Btn text='DELETE POST' style={{marginTop: 10, alignSelf: 'center'}} onPress={deletePost} />
                        }

                    </View>
                </Modal>
            </ScrollView>
        )
    }
}


//styles
const styles = StyleSheet.create({
    screen: {
        paddingTop: StatusBar.currentHeight,
    },

    subtext: {
        fontFamily: 'poppins',
        fontSize: RFPercentage(2.8),
        fontWeight: 'bold',
        opacity: 0.5
    },

    heading: {
        fontFamily: 'poppins_bold',
        fontSize: RFPercentage(3.8)
    },

    details: {
        fontFamily: 'poppins',
        opacity: 0.5,
        lineHeight: 22,
        fontSize: RFPercentage(2.1)
    },

    searchContainer: {
        backgroundColor: 'rgba(0, 185, 117, 0.1)',
        width: w*0.85,
        padding: 10,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 12
    },

    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: w,
        marginTop: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-evenly'
    },

    box: {
        width: w*0.43,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 15,
        marginBottom: 15
    }
})

