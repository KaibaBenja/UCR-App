import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { VStack } from "../components/ui/vstack";
import axios from "axios";
import HeaderOut from "@/components/layout/header-out";

interface NewsDetailProps {
  title: string;
  description: string;
  creator: string | null;
  image_url: string | null;
  pubDate: string;
}

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<NewsDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(
          "https://newsdata.io/api/1/news?apikey=pub_536246cd15345c373d46e2bfbc8a06ae3fbc1&country=ar,gb,us&language=en,es",
        );
        const foundNews = response.data.results.find(
          (item: any) => item.article_id === id,
        );
        setNews(foundNews || null);
        console.log(foundNews);
      } catch (error) {
        console.error("Error al obtener detalles de la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-4" />;
  }

  if (!news) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Noticia no encontrada {id}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Stack.Screen
        options={{
          headerTitle: "",
          header: () => <HeaderOut title="Noticia" />,
        }}
      />
      <Image
        source={{
          uri: news.image_url
            ? news.image_url
            : "https://via.placeholder.com/300",
        }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <VStack className="p-4">
        <Text className="text-xl font-bold mb-2">{news.title}</Text>
        <Text className="text-sm text-gray-500 mb-1">
          {news.creator ?? "Desconocido"}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {new Date(news.pubDate).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-600">{news.description}</Text>
      </VStack>
    </ScrollView>
  );
}
