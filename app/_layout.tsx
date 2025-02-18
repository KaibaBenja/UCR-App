import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/layout/headers";

export default function layout() {
  return (
    <GluestackUIProvider>
      <View className="flex-1 ">
        <Stack
          screenOptions={{
            headerTitle: "",
            header: () => <Header />,
          }}
        />
      </View>
    </GluestackUIProvider>
  );
}
