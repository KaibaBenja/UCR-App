import { LoginTop } from "@/assets/images";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { auth, db } from "@/config/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [user, setUser] = useState<User | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "La confirmación de contraseña es obligatoria";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: formData.email,
        perfilCompleto: false,
      });

      Alert.alert("Registro exitoso", "Bienvenido");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center relative w-full">
      <Image
        source={LoginTop}
        className="w-full h-full absolute z-0"
        alt="ucr digital"
        resizeMode="cover"
      />
      <VStack className="flex gap-5 mt-72 items-center justify-center w-full p-3">
        <Text
          style={{ fontFamily: "Comforta" }}
          className="text-3xl text-red-600"
        >
          Registrarse
        </Text>
        <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
          <FontAwesome name="envelope" size={20} />
          <TextInput
            placeholder="Correo Electrónico"
            className="flex-1 px-3"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ fontFamily: "Comforta" }}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </HStack>
        {errors.email && <Text className="text-red-500">{errors.email}</Text>}
        <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
          <FontAwesome name="lock" size={20} />
          <TextInput
            style={{ fontFamily: "Comforta" }}
            placeholder="Contraseña"
            className="flex-1 px-3"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} />
          </TouchableOpacity>
        </HStack>
        {errors.password && (
          <Text className="text-red-500">{errors.password}</Text>
        )}

        {/* Confirmar Contraseña */}
        <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
          <FontAwesome name="lock" size={20} />
          <TextInput
            style={{ fontFamily: "Comforta" }}
            placeholder="Confirmar contraseña"
            className="flex-1 px-3"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye" : "eye-slash"}
              size={20}
            />
          </TouchableOpacity>
        </HStack>
        <VStack className="w-full flex flex-col items-center gap-4 mb-4">
          <TouchableOpacity
            className="bg-red-600 w-full py-4 rounded-md items-center justify-center mt-4"
            onPress={handleRegister}
          >
            <Text
              className="text-white font-semibold"
              style={{ fontFamily: "Comforta" }}
            >
              Registrarse
            </Text>
          </TouchableOpacity>
        </VStack>

        {/* Link de Login */}
        <Link href="/" className="underline">
          Ya tengo una cuenta
        </Link>
      </VStack>
    </View>
  );
}
