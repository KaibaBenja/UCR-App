import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Image } from "../ui/image";
import { LogoBlanco } from "@/assets/images";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HStack } from "../ui/hstack";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { useState } from "react";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

export default function Header() {
  const [showDrawer, setShowDrawer] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      router.replace("/login"); // Redirigir al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };
  return (
    <View className="bg-red-600 px-4 w-full" style={{ paddingTop: insets.top }}>
      <HStack className="flex items-center justify-between ">
        <Image source={LogoBlanco} className="size-6" />
        <Text className="text-white font-bold text-2xl">Inicio</Text>
        <Pressable onPress={() => setShowDrawer(true)}>
          <MaterialIcons name="menu" size={30} color="white" />
        </Pressable>
        <Drawer
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          anchor="right"
        >
          <DrawerBackdrop />
          <DrawerContent className="bg-white w-3/4 h-full">
            <DrawerHeader
              className="p-4 border-b border-gray-200"
              style={{ paddingTop: insets.top }}
            >
              <View className="flex-row justify-between items-center w-full">
                <Text className="text-xl font-bold text-red-600">Menu</Text>
                <TouchableOpacity onPress={() => setShowDrawer(false)}>
                  <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </DrawerHeader>
            <DrawerBody>
              <View className="p-4 flex flex-col gap-4">
                <Link href="/" asChild onPress={() => setShowDrawer(false)}>
                  <TouchableOpacity className="flex-row items-center py-3 bg-rose-100 px-2 rounded-lg">
                    <MaterialIcons name="home" size={24} color="red" />
                    <Text className="ml-4 text-lg text-gray-800">Home</Text>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity className="flex-row items-center py-3 bg-rose-100 px-2 rounded-lg mt-2">
                  <MaterialIcons name="settings" size={24} color="red" />
                  <Text className="ml-4 text-lg text-gray-800">
                    Editar Perfil
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center py-3 bg-rose-100 px-2 rounded-lg mt-2"
                  onPress={handleLogout}
                >
                  <MaterialIcons name="logout" size={24} color="red" />
                  <Text className="ml-4 text-lg text-gray-800">
                    Cerrar Sesión
                  </Text>
                </TouchableOpacity>
              </View>
            </DrawerBody>
            <DrawerFooter className="p-4 border-t border-gray-200">
              <Text className="text-center text-gray-600 italic">
                © 2025 UCR-Corrientes
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </HStack>
    </View>
  );
}
