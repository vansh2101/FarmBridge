//Importing modules
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

//Importing firebase requirements
import  firebase from 'firebase/compat/app';
import { firebaseConfig } from "../firebase/config";

//Importing Screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from "../screens/HomeScreen";
import TabNav from "./TabNav";


//Global variables
const Stack = createNativeStackNavigator()


//main function
export default function StackNav(){
    if (!firebase.apps.length) {
        console.log('Connected with Firebase')
        firebase.initializeApp(firebaseConfig);
    }

    return(
        <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: 'white'}}}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='AuthScreen' component={AuthScreen} />
                <Stack.Screen name='Tabs' component={TabNav} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}