import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import Main from "../../components/Main";
import "../../global.css";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <View className="flex h-screen items-center justify-center">
        <Text>Cargando....</Text>
      </View>
    );
  }

  return <Main />;
}
