import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Header from "@/components/layout/headers";
import HeaderOut from "@/components/layout/header-out";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
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
          header: () => <Header />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="home"
              size={24}
              color={color}
              style={{
                borderRadius: 40,
                borderWidth: 1,
                borderColor: "#dc2626",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          header: () => <HeaderOut title="About" />,
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="question"
              size={24}
              color={color}
              style={{
                borderRadius: 40,
                borderWidth: 1,
                borderColor: "#dc2626",
                paddingHorizontal: 5,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
