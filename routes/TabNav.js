//Importing modules
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Importing Screens
import HomeScreen from '../screens/HomeScreen';
import PendingScreen from '../screens/PendingScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';


//Global variables
const Tab = createBottomTabNavigator();


//main function
export default function TabNav(){
    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color}) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    }
                    else if (route.name === 'Pending'){
                        iconName = 'filetext1'
                    }
                    else if (route.name === 'My Orders'){
                        iconName = 'shoppingcart'
                    }
                    else if (route.name === 'Profile'){
                        iconName = 'user'
                    }

                    return <AntDesign name={iconName} size={22} color={color} />;
                },

                tabBarActiveTintColor: '#00b975',
                tabBarInactiveTintColor: '#bfbfbf',
                headerShown: false,
                tabBarStyle:{
                    elevation: 10,
                    borderTopWidth: 0
                }
            })}
        >
            <Tab.Screen name='Home' component={HomeScreen}/>
            <Tab.Screen name='Pending' component={PendingScreen}/>
            <Tab.Screen name='My Orders' component={OrderScreen}/>
            <Tab.Screen name='Profile' component={ProfileScreen}/>
        </Tab.Navigator>
    )
}