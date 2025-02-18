import { Tabs } from "expo-router";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#dc2626",
        tabBarInactiveTintColor: "#dc2626",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 80,
          position: "absolute",
          bottom: 10,
          left: 25,
          marginHorizontal: 15,
          right: 25,
          borderRadius: 40,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
          display: "flex",
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="question" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
