import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import React, { useEffect, useState } from "react";
import { Box } from "./ui/box";
import { Image } from "./ui/image";
import { VStack } from "./ui/vstack";
import axios from "axios";
interface NewsCardProps {
  article_id: string;
  title: string;
  description: string;
  creator: string;
  image_url: string;
  pubDate: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  article_id,
  title,
  description,
  creator,
  image_url,
  pubDate,
}) => (
  <Link href={`../${article_id}`} className="mb-4">
    <View className="bg-white rounded-lg shadow-md overflow-hidden mb-4 w-full">
      <Image
        source={image_url ? image_url : "https://via.placeholder.com/300"}
        className="w-full h-48"
        resizeMode="cover"
      />
      <VStack className="p-4">
        <Text className="text-lg font-bold mb-2">{title}</Text>
        <Text className="text-sm text-gray-500 mb-1">
          {creator ?? "Desconocido"}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">
          {new Date(pubDate).toLocaleDateString()}
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
          "https://newsdata.io/api/1/news?apikey=pub_536246cd15345c373d46e2bfbc8a06ae3fbc1&country=ar,gb,us&language=en,es",
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
          keyExtractor={(item) => item.article_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        />
      )}
    </View>
  );
}
