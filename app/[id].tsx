import { router, Stack, useLocalSearchParams, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { VStack } from "../components/ui/vstack";
import axios from "axios";
import HeaderOut from "@/components/layout/header-out";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";

interface NewsDetailProps {
  id: string;
  title: string;
  text: string;
  href: string;
  author: string;
  image: string;
  published_date: string;
}

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<NewsDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState(""); // Estado para el comentario
  const [comments, setComments] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();
  const MAX_LENGTH = 500;
  const publicRoutes = ["login", "register", "forgot-password"];

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(
          "https://api.worldnewsapi.com/search-news?api-key=7c2f16bfcce34912bf9c6452727a097e&language=es",
        );

        const foundNews = response.data.news.find(
          (item: any) => String(item.id) === String(id),
        );

        if (foundNews) {
          setNews({
            id: foundNews.id.toString(),
            title: foundNews.title,
            text: foundNews.text ?? "No hay contenido disponible.",
            href: foundNews.url ?? "#",
            author:
              foundNews.author ||
              (foundNews.authors?.join(", ") ?? "Desconocido"),
            image: foundNews.image || "https://via.placeholder.com/300",
            published_date: foundNews.publish_date,
          });
        } else {
          setNews(null);
        }
      } catch (error) {
        console.error("Error al obtener detalles de la noticia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user && !publicRoutes.includes(segments[0])) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [segments]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" className="mt-4" />;
  }

  if (!news && !loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Noticia no encontrada {id}</Text>
      </View>
    );
  }

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShown: true,
          header: () => <HeaderOut title="Noticia" />,
        }}
      />
      <Image
        source={{ uri: news?.image }}
        alt="News"
        className="w-full h-48"
        resizeMode="cover"
      />
      <VStack className="p-4">
        <Text className="text-xl font-bold mb-2">{news?.title}</Text>
        <Text className="text-sm text-gray-500 mb-1">{news?.author}</Text>
        <Text className="text-sm text-gray-500 mb-2">
          {new Date(news?.published_date!).toLocaleDateString()}
        </Text>
        <Text>
          {expanded || news?.text.length! <= MAX_LENGTH
            ? news?.text
            : news?.text.slice(0, MAX_LENGTH) + "..."}
        </Text>

        {news?.text.length! > MAX_LENGTH && (
          <TouchableOpacity>
            <Text
              className="text-blue-500"
              onPress={() => setExpanded(!expanded)}
            >
              {expanded ? "Ver menos" : "Leer más..."}
            </Text>
          </TouchableOpacity>
        )}
      </VStack>
      <VStack className="p-4 border-t border-gray-300 mt-4">
        <Text className="text-lg font-semibold mb-2">Comentarios</Text>

        {/* Input para escribir un comentario */}
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-2"
          placeholder="Escribe un comentario..."
          value={comment}
          onChangeText={setComment}
        />

        {/* Botón para agregar comentario */}
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded-lg mb-2"
          onPress={handleAddComment}
        >
          <Text className="text-white text-center">Enviar</Text>
        </TouchableOpacity>

        {/* Lista de comentarios */}
        {comments.length > 0 ? (
          comments.map((item, index) => (
            <View key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
              <HStack space="md">
                <Avatar className="bg-indigo-600">
                  <AvatarFallbackText className="text-white">
                    Usuario
                  </AvatarFallbackText>
                </Avatar>
                <VStack>
                  <Heading size="sm">Usuario</Heading>
                  <Text className="text-gray-700">{item}</Text>
                </VStack>
              </HStack>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">No hay comentarios aún.</Text>
        )}
      </VStack>
    </ScrollView>
  );
}
