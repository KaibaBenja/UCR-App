import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function About() {
  return (
    <ScrollView>
      <Text className="text-2xl font-bold mb-8">Acerca de</Text>
      <Link asChild href="/" className="text-blue-400 text-2xl font-bold">
        <Pressable>
          <FontAwesome5 name="home" size={24} color="black" />
        </Pressable>
      </Link>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi earum
        nesciunt, repellendus non qui eos ipsam eligendi sequi placeat quod ipsa
        libero quibusdam dolor enim nobis illum esse dolores voluptatum?
      </Text>
    </ScrollView>
  );
}
