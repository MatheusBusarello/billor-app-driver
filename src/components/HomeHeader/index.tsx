import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, View } from "react-native";                     
import { UserPhoto } from "../UserPhoto";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from "react";

import { auth } from "../../config/firebase";

import { User, LogOut } from "lucide-react-native";

export function HomeHeader() {
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName);

  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + 32;

  useFocusEffect(
    useCallback(() => {
      auth.currentUser?.reload().then(() => {
        setPhotoURL(auth.currentUser?.photoURL);
        setDisplayName(auth.currentUser?.displayName);
      });
    }, [])
  );

  function handleLogout() {
    auth.signOut();
  }

  const hasUserPhoto = !!photoURL;

  return (
    <HStack bg="$gray600" style={{ paddingTop }} pb="$5" px="$8" alignItems="center" gap="$4">
      {hasUserPhoto ? (
        <UserPhoto 
          source={{ uri: photoURL }}
          w="$16"
          h="$16"
          alt="Profile image"
        />
      ) : (
        <View 
          style={{ 
            width: 64, 
            height: 64, 
            borderRadius: 32, 
            backgroundColor: "$gray500", 
            justifyContent: "center", 
            alignItems: "center" 
          }}
        >
          <Icon as={User} color="$gray100" size="xl" />
        </View>
      )}

      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Hello, 
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {displayName || "Driver"}
        </Heading>
      </VStack>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Icon as={LogOut} color="$gray100" size="xl" />
      </TouchableOpacity>
    </HStack>
  );
}
