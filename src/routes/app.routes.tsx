import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import { Home } from "../screens/Home";
import { Profile } from "../screens/Profile";
import { Support } from "../screens/Support";

import { gluestackUIConfig } from "../../config/gluestack-ui.config"

import { House, Headset, UserCircle } from "phosphor-react-native";  

type AppRoutes = {
  home: undefined;
  profile: undefined;
  support: undefined;
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space["6"]

  return (
    <Navigator 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.blue300,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === "android" ? "auto" : 96,
          paddingBottom: tokens.space["14"],
          paddingTop: tokens.space["4"],
          alignItems: "center",
          justifyContent: "center"
        },
      }}
    >
      <Screen 
        name="home" 
        component={Home}
        options={{ tabBarIcon: ({ color }) => <House color={color} size={iconSize}/> }}
      />

      <Screen 
        name="support" 
        component={Support} 
        options={{ tabBarIcon: ({ color }) => <Headset color={color} size={iconSize}/> }}  
      />

      <Screen 
        name="profile" 
        component={Profile}
        options={{ tabBarIcon: ({ color }) => <UserCircle color={color} size={iconSize}/> }}  
      />
    </Navigator>
  )
}