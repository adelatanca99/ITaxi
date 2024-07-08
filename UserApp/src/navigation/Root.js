<<<<<<< HEAD
import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeNavigator from "./Home";
import CustomDrawer from "./CustomDrawer";
=======
import React, { useState } from "react";
import { View, Text, Pressable, Appearance } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import styles from './styles';
import HomeNavigator from "./Home";
import HistoryScreen from "../screens/HistoryScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import PromotiiScreen from "../screens/PromotiiScreen";
import RatingScreen from "../screens/RatingScreen";
import PaymentScreen from "../screens/PaymentScreen";
import CustomDrawer from "./CustomDrawer";
import AntDesign from "react-native-vector-icons/AntDesign";
import HistoryNavigator from "./History";
>>>>>>> f309f4de629da70f6abc7c22d1846646794ed3ee

const Drawer = createDrawerNavigator();

const DummyScreen = (props) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      alignItems: "center",
    }}
  >
    <Text>{props.name}</Text>
  </View>
);

const RootNavigator = (props) => {
<<<<<<< HEAD
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen name="Home" component={HomeNavigator} />

        <Drawer.Screen name="Your trips">
          {() => <DummyScreen name={"Your trips"} />}
        </Drawer.Screen>

        <Drawer.Screen name="Help">
          {() => <DummyScreen name={"Help"} />}
        </Drawer.Screen>

        <Drawer.Screen name="Wallet">
          {() => <DummyScreen name={"Wallet"} />}
        </Drawer.Screen>

        <Drawer.Screen name="Settings">
          {() => <DummyScreen name={"Settings"} />}
        </Drawer.Screen>
=======
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme);
  });
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="Călătorește"
          component={HomeNavigator}
          options={{
            drawerIcon: (config) => (
              <AntDesign name={"car"} size={20} color={"gray"} />
            ),
          }}
        />

        <Drawer.Screen
          name="Istoric curse"
          component={HistoryNavigator}
          options={{
            drawerIcon: (config) => (
              <AntDesign name={"clockcircleo"} size={20} color={"gray"} />
            ),
          }}
        ></Drawer.Screen>
        <Drawer.Screen
          name="Despre noi"
          component={AboutUsScreen}
          options={{
            drawerIcon: (config) => (
              <AntDesign name={"infocirlceo"} size={20} color={"gray"} />
            ),
          }}
        ></Drawer.Screen>
        <Drawer.Screen
          name="Promoții"
          component={PromotiiScreen}
          options={{
            drawerItemStyle: { height: 0 },
            drawerIcon: (config) => (
              <AntDesign name={"tago"} size={20} color={"white"} />
            ),
          }}
        ></Drawer.Screen>
>>>>>>> f309f4de629da70f6abc7c22d1846646794ed3ee
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
