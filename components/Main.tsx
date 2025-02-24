import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import axios from "axios";
interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  creator: string;
  image: string;
  published_at: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  description,
  creator,
  image,
  published_at,
}) => (
  <Link href={`../${id}`} className="mb-4">
    <View className="bg-white rounded-lg shadow-md overflow-hidden mb-4 w-full">
      <Image
        source={image ? image : "https://via.placeholder.com/300"}
        className="w-full h-48"
        resizeMode="cover"
        alt="News"
      />
      <VStack className="p-4">
        <Text className="text-lg font-bold mb-2">{title}</Text>
        <Text className="text-sm text-gray-500 mb-1">
          {creator ?? "Desconocido"}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {new Date(published_at).toLocaleDateString()}
        </Text>
        <Text className="text-sm text-gray-600">{description}</Text>
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
          "https://api.apitube.io/v1/news/everything?language.code=es&sort_by=published_at&sort_order=asc&api_key=api_live_9UjOou8RIHHXvohn2ObMvaoThX4ErO2IW1ISlOFhh6",
        );
        setNews(response.data.results);
        console.log("Noticias:", response.data.results);
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
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}
    </View>
  );
}
