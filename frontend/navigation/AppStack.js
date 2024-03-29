import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ProfileScreen from "../screens/Profile/ProfileScreen";
import CustomDrawer from "../components/CustomDrawer";
import TabNavigator from "./TabNavigator";
import { createPushNotificationFactory } from "../services/NotificationFactory";
import { GardenStack } from "./CRUDGardenStack";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Sidebar Navigator
const AppStack = () => {
  const pushNotificationFactory = createPushNotificationFactory();
  useEffect(()=>{
    const pushNotification = pushNotificationFactory.createPushNotification();
    pushNotification.registerForPushNotifications();
  },[])
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#006500",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -10,
          fontFamily: "MontserratSemiBold",
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Gardens"
        component={GardenStack}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="fence" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
