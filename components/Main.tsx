import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button, ButtonText } from "./ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./ui/modal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

export default function Main() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <View>
      <Text>Main</Text>
      <Link href="/about" className="text-blue-400 mt-5 text-xl">
        Ir al About
      </Link>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Delete Post</ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <View className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <FontAwesome name="trash-o" size={24} color="black" />
            </View>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Text className="text-typography-950 mb-2 text-center">
              Delete blog post
            </Text>
            <Text className="text-typography-500 text-center">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setShowModal(false);
              }}
              className="flex-grow"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}
