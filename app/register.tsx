import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { auth, db } from "../config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { VStack } from "../components/ui/vstack";
import { HStack } from "../components/ui/hstack";
import { Link, router, useSegments } from "expo-router";
import { Image } from "@/components/ui/image";
import { LogoBlanco } from "@/assets/images";
import { Heading } from "@/components/ui/heading";
import DateTimePicker from "@react-native-community/datetimepicker";

interface FormData {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  genero: string;
  email: string;
  telefono: string;
  localidad: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    telefono: "",
    localidad: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments;

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.dni) newErrors.dni = "El DNI es obligatorio";
    if (!formData.fechaNacimiento)
      newErrors.fechaNacimiento = "La fecha es obligatoria";
    if (!formData.genero) newErrors.genero = "El género es obligatorio";
    if (!formData.localidad)
      newErrors.localidad = "La localidad es obligatoria";
    if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio";
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
        nombre: formData.nombre,
        email: formData.email,
      });

      Alert.alert("Registro exitoso", `Bienvenido, ${formData.nombre}`);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        handleChange("fechaNacimiento", currentDate.toDateString());
      }
    }
  };

  const confirmIOSDate = (event: any) => {
    handleChange("fechaNacimiento", date.toDateString());
    toggleDatePicker();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [segments]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full"
    >
      <ScrollView className="flex-1 bg-white ">
        <HStack
          className={
            Platform.OS === "ios"
              ? "p-3 pt-14 bg-red-600 items-center"
              : "p-3  bg-red-600 items-center"
          }
        >
          <Image source={LogoBlanco} size="sm" />
          <Text className="text-white font-bold text-2xl m-auto pr-10">
            Registro
          </Text>
        </HStack>
        <Heading className="text-center mt-5">
          <Text className="text-5xl text-red-600">Registrarse</Text>
        </Heading>
        <VStack className="flex gap-4 mt-10 items-center px-4 w-full">
          {/* Nombre */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="user" size={20} />
            <TextInput
              placeholder="Nombre"
              className="flex-1 px-3"
              value={formData.nombre}
              onChangeText={(text) => handleChange("nombre", text)}
            />
          </HStack>
          {errors.nombre && (
            <Text className="text-red-500">{errors.nombre}</Text>
          )}

          {/* Apellido */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="user" size={20} />
            <TextInput
              placeholder="Apellido"
              className="flex-1 px-3"
              value={formData.apellido}
              onChangeText={(text) => handleChange("apellido", text)}
            />
          </HStack>
          {errors.apellido && (
            <Text className="text-red-500">{errors.apellido}</Text>
          )}

          {/* DNI y Fecha de Nacimiento */}
          <HStack className="gap-4 w-full">
            <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 flex-1">
              <FontAwesome name="id-card" size={20} />
              <TextInput
                placeholder="DNI"
                className="flex-1 px-3"
                keyboardType="numeric"
                value={formData.dni}
                onChangeText={(text) => handleChange("dni", text)}
              />
            </HStack>
            <HStack className="border-red-300 rounded-lg border-2 items-center p-2 flex-1">
              <FontAwesome name="calendar" size={20} />
              {!showPicker && (
                <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    placeholder="Fecha de Nacimiento"
                    className="flex-1 px-3"
                    keyboardType="numeric"
                    value={formData.fechaNacimiento}
                    onChangeText={(text) =>
                      handleChange("fechaNacimiento", text)
                    }
                    editable={false}
                    onPressIn={toggleDatePicker}
                  />
                </Pressable>
              )}
            </HStack>
          </HStack>
          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
              maximumDate={new Date("2035-1-1")}
              minimumDate={new Date("1950-1-1")}
            />
          )}
          {showPicker && Platform.OS === "ios" && (
            <View className="flex flex-row gap-5 justify-around">
              <TouchableOpacity
                className="rounded-lg border-2"
                onPress={toggleDatePicker}
              >
                <Text className="p-2 text-red-600 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-300 rounded-md "
                onPress={confirmIOSDate}
              >
                <Text className="p-2 text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Género */}
          <HStack className="w-full justify-center">
            <TouchableOpacity
              onPress={() => handleChange("genero", "Masculino")}
              className="p-4  border-t border-b border-l flex-1 w-full"
              style={{
                backgroundColor: `${formData.genero === "Masculino" ? "#ef4444" : "#999"}`,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            >
              <Text className="font-medium text-center text-white">
                Masculino
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleChange("genero", "Femenino")}
              style={{
                backgroundColor: `${formData.genero === "Femenino" ? "#ef4444" : "#999"}`,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderStartColor: "#999",
              }}
              className="p-4 border-t border-r border-b flex-1 w-full"
            >
              <Text className="font-medium text-center text-white">
                Femenino
              </Text>
            </TouchableOpacity>
          </HStack>
          {errors.genero && (
            <Text className="text-red-500">{errors.genero}</Text>
          )}
          {/* Email */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="envelope" size={20} />
            <TextInput
              placeholder="Correo Electrónico"
              className="flex-1 px-3"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </HStack>
          {errors.email && <Text className="text-red-500">{errors.email}</Text>}
          {/* Telefono */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="phone" size={20} />
            <TextInput
              placeholder="Telefono sin 0 ni 1"
              className="flex-1 px-3"
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={formData.telefono}
              onChangeText={(text) => handleChange("telefono", text)}
            />
          </HStack>
          {errors.telefono && (
            <Text className="text-red-500">{errors.telefono}</Text>
          )}

          {/* Localidad */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="map-marker" size={20} />
            <TextInput
              placeholder="Seleccione Localidad"
              className="flex-1 px-3"
              keyboardType="default"
              autoCapitalize="none"
              value={formData.localidad}
              onChangeText={(text) => handleChange("localidad", text)}
            />
          </HStack>
          {errors.localidad && (
            <Text className="text-red-500">{errors.localidad}</Text>
          )}

          {/* Contraseña */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="lock" size={20} />
            <TextInput
              placeholder="Contraseña"
              className="flex-1 px-3"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
              />
            </TouchableOpacity>
          </HStack>
          {errors.password && (
            <Text className="text-red-500">{errors.password}</Text>
          )}

          {/* Confirmar Contraseña */}
          <HStack className="border-red-300 rounded-lg border-2 items-center gap-2 p-2 w-full">
            <FontAwesome name="lock" size={20} />
            <TextInput
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
          {errors.confirmPassword && (
            <Text className="text-red-500">{errors.confirmPassword}</Text>
          )}

          {/* Botón de Registro */}
          <VStack className="w-full flex flex-col items-center gap-4 mb-4">
            <TouchableOpacity
              className="bg-red-600 w-full py-4 rounded-md items-center justify-center mt-4"
              onPress={handleRegister}
            >
              <Text className="text-white font-semibold">Registrarse</Text>
            </TouchableOpacity>

            {/* Link de Login */}
            <Link href="/" className="underline">
              Ya tengo una cuenta
            </Link>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
