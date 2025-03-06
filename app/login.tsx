import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginTop } from "@/assets/images";
import { Image } from "../components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { Link, router, useSegments } from "expo-router";
import { doc, getDoc } from "firebase/firestore";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [eyePressed, setEyePressed] = useState(true);
  const segments = useSegments();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [user, setUser] = useState<User | null>(null);

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    let isValid = true;
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (!userDoc.exists()) {
        Alert.alert("Error", "No se encontraron datos del usuario");
        return;
      }

      const userData = userDoc.data();
      Alert.alert("Inicio de sesión exitoso", `Bienvenido ${userData.nombre}`);

      // Redirigir al usuario
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
      console.error(error);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const toggleEye = () => setEyePressed(!eyePressed);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white items-center justify-center relative w-full">
        <Image
          source={LoginTop}
          className="w-full h-full absolute z-0"
          alt="ucr digital"
          resizeMode="cover"
        />
        <VStack className="flex gap-5 mt-72 items-center justify-center w-full">
          <HStack className="border-gray-600 border-b-2 items-center gap-2">
            <FontAwesome name="user" size={20} />
            <TextInput
              placeholder="Usuario"
              className="bg-white w-[75%] px-3"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ fontFamily: "Comforta" }}
            />
          </HStack>
          {errors.email && <Text className="text-red-500">{errors.email}</Text>}

          <HStack className="border-gray-600 border-b-2 items-center gap-2">
            <FontAwesome name="lock" size={20} />
            <TextInput
              placeholder="Contraseña"
              className="bg-white w-[69%] px-3"
              secureTextEntry={eyePressed}
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              style={{ fontFamily: "Comforta" }}
            />
            <Pressable onPress={toggleEye}>
              <FontAwesome name={eyePressed ? "eye" : "eye-slash"} size={20} />
            </Pressable>
          </HStack>
          {errors.password && (
            <Text className="text-red-500">{errors.password}</Text>
          )}

          <VStack className="flex mt-5 gap-10 w-[75%] items-center">
            <Link
              href="/"
              className="underline"
              style={{ fontFamily: "Comforta" }}
            >
              Recuperar Contraseña
            </Link>
            <Link
              href="/register"
              className="underline"
              style={{ fontFamily: "Comforta" }}
            >
              Registrarse
            </Link>
            <TouchableOpacity
              className="bg-red-600 w-96 py-6 flex items-center rounded-md justify-center"
              onPress={handleLogin}
            >
              <Text
                className="text-white font-semibold"
                style={{ fontFamily: "Comforta" }}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </View>
    </KeyboardAvoidingView>
  );
}
