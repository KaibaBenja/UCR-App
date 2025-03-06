import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import axios from "axios";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  creator: string;
  image: string;
  published_date: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  summary,
  creator,
  image,
  published_date,
}) => (
  <Link href={`../${id}`} className="mb-4">
    <View className="bg-white rounded-lg shadow-md overflow-hidden mb-4 w-full">
      <Image
        source={image || "https://via.placeholder.com/300"}
        className="w-full h-48"
        resizeMode="cover"
        alt="News"
      />
      <VStack className="p-4">
        <Text className="text-lg font-bold mb-2">{title}</Text>
        <Text className="text-sm text-gray-500 mb-1">
          {creator || "Desconocido"}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {new Date(published_date).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-600">{summary}</Text>
      </VStack>
    </View>
  </Link>
);

export default function Main() {
  const [news, setNews] = useState<NewsCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://api.worldnewsapi.com/search-news?api-key=7c2f16bfcce34912bf9c6452727a097e&language=es",
        );

        const mappedNews = response.data.news.map((item: any) => ({
          id: item.id.toString(), // Convertimos id a string
          title: item.title,
          summary: item.summary || "No hay resumen disponible.",
          creator: item.author || (item.authors?.join(", ") ?? "Desconocido"), // Si hay múltiples autores, los unimos
          image: item.image || "https://via.placeholder.com/300", // Si no hay imagen, ponemos un placeholder
          published_date: item.publish_date, // Mantenemos el nombre correcto
        }));

        setNews(mappedNews);
      } catch (error) {
        console.error("Error al obtener noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 pt-5">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
      ) : (
        <FlatList
          data={news}
          renderItem={({ item }) => <NewsCard {...item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}
    </View>
  );
}
