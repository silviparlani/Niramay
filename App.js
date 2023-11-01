import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, Signup, Welcome, Assistant_form } from "./screens";
import CustomerForm from './screens/CustomerForm';
import HomePage from './screens/HomePage';
import ViewForm from './screens/ViewForm';
import IsChildAlreadyPresent from './screens/IsChildAlreadyPresent';
import COLORS from './constants/colors';
import ChildPresent from './screens/ChildPresent';
import GeneralHistoryForm from './screens/GeneralHistoryForm';
import IsChild from './screens/IsChild';
import ChildReport from './screens/ChildReport'
import GeneralHistoryDisplay from './screens/GeneralHistoryDisplay';
import ConsolidatedReports from './screens/ConsolidatedReports';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="teal" barStyle="light-content" />
      <StatusBar hidden={true} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
              shadowColor: 'transparent'
            }}
          />

          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{
              headerShown: false,


              // headerStyle: {
              //   backgroundColor: COLORS.theme, // Set your desired background color
              //   paddingVertical: 10, // Add vertical padding to the header
              // },
              // headerTintColor: COLORS.white,
              // title: 'Home'
              // // headerTintColor: COLORS.white,
            }}
          />

          <Stack.Screen
            name="CustomerForm"
            component={CustomerForm}
            options={{

              headerStyle: {
                backgroundColor: 'teal', // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Personal Information'
              // headerTintColor: COLORS.white,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,

            }}

          />


          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
            }}
          />
          <Stack.Screen
            name="IsChildAlreadyPresent"
            component={IsChildAlreadyPresent}
            options={{
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Child Profile'


            }}
          />
          <Stack.Screen
            name="ViewForm"
            component={ViewForm}
            options={{
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
              title: 'Child Profile'


            }}
          />
          <Stack.Screen
            name="ChildPresent"
            component={ChildPresent}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color
              },
              headerTintColor: COLORS.white,
            }}
          />

          <Stack.Screen
            name="GeneralHistoryForm"
            component={GeneralHistoryForm}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Medical Form",
            }}
          />
          <Stack.Screen
            name="GeneralHistoryDisplay"
            component={GeneralHistoryDisplay}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />
          <Stack.Screen
            name="IsChild"
            component={IsChild}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Child Profile",
            }}
          />
          <Stack.Screen
            name="ChildReport"
            component={ChildReport}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "Report",
            }}
          />

          <Stack.Screen
            name="ConsolidatedReports"
            component={ConsolidatedReports}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "ConsolidatedReport",
            }}
          />
          
          {/* <Stack.Screen
            name="BitNamevsGenderGraph"
            component={BitNamevsGenderGraph}
            options={{
              // headerShown: false,
              headerStyle: {
                backgroundColor: COLORS.theme, // Set your desired background color

              },
              headerTintColor: COLORS.white,
              title: "BitNamevsGenderGraph",
            }}
          /> */}

        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}