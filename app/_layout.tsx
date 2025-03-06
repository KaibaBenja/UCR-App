import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ActivityIndicator, View } from "react-native";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useFonts } from "expo-font";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const publicRoutes = ["login", "register", "forgot-password"];
  const [isLoaded] = useFonts({
    Comforta: require("../assets/fonts/Comfortaa.ttf"),
  });

  const handleOnLayout = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      const isPublicRoute =
        segments.length > 0 && publicRoutes.includes(segments[0]);

      if (!user && !isPublicRoute) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [segments, router]);

  if (loading || !isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GluestackUIProvider>
      <View className="flex-1" onLayout={handleOnLayout}>
        <Stack
          screenOptions={{
            headerTitle: "",
            headerShown: false,
          }}
        />
      </View>
    </GluestackUIProvider>
  );
}
