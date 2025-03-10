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
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { VStack } from "../components/ui/vstack";
import { HStack } from "../components/ui/hstack";
import { Link, router, useLocalSearchParams, useSegments } from "expo-router";
import { Image } from "../components/ui/image";
import { LogoBlanco } from "../assets/images";
import { Heading } from "../components/ui/heading";
import DateTimePicker from "@react-native-community/datetimepicker";

interface FormData {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  localidad: string;
}

export default function CompleteProfile() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    localidad: "",
  });
  const { uid } = useLocalSearchParams(); // Obtiene el UID de la URL
  const userId = Array.isArray(uid) ? uid[0] : uid; // Ensure uid is a string

  console.log("UID del usuario:", uid);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const userRef = doc(db, "usuarios", userId);

      // 🔹 Verificar si el DNI ya existe en otro usuario
      const dniQuery = query(
        collection(db, "usuarios"),
        where("dni", "==", formData.dni),
      );
      const dniSnapshot = await getDocs(dniQuery);

      if (!dniSnapshot.empty) {
        Alert.alert("Error", "Este DNI ya está registrado en otro usuario.");
        return;
      }

      // 🔹 Verificar si el documento del usuario ya existe
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // 🔸 Si existe, actualizar datos
        await updateDoc(userRef, {
          ...formData,
          perfilCompleto: true,
        });
      } else {
        // 🔸 Si no existe, crearlo
        await setDoc(userRef, {
          uid,
          email: user?.email || "", // Guarda el email en caso de necesidad
          ...formData,
          perfilCompleto: true,
        });
      }

      Alert.alert(
        "Perfil Completado Exitosamente",
        `Bienvenido, ${formData.nombre}`,
      );
      router.replace("/login");
    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert("Error", "Hubo un problema al guardar los datos.");
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

      if (!user) {
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

          {/* Botón de Registro */}
          <VStack className="w-full flex flex-col items-center gap-4 mb-4">
            <TouchableOpacity
              className="bg-red-600 w-full py-4 rounded-md items-center justify-center mt-4"
              onPress={handleRegister}
            >
              <Text className="text-white font-semibold">Registrarse</Text>
            </TouchableOpacity>

            {/* Link de Login */}
            <Link href="/login" className="underline">
              Ya tengo una cuenta
            </Link>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
