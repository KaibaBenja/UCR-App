import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View } from "react-native";
import { Slot } from "expo-router";

export default function layout() {
  return (
    <GluestackUIProvider>
      <View className="flex-1 items-center justify-center">
        <Slot />
      </View>
    </GluestackUIProvider>
  );
}
