import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
} from "@gluestack-ui/themed";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { AuthNavigationRoutesProps } from "../../routes/auth.routes";
import BackgroundImg from "../../assets/backgroundImg.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export function SignUp() {
  const navigation = useNavigation<AuthNavigationRoutesProps>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert("Register", "Fill in all fields");
    }

    if (password.length < 6) {
      return Alert.alert(
        "Password",
        "The password must have more than 6 characters"
      );
    }

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {         
        displayName: name,       
      }); 

      Alert.alert("Register", "Account created successfully");
      navigation.goBack();
    } catch (error: any) {       
      setIsLoading(false); 

      if (error.code === "auth/email-already-in-use") {         
        return Alert.alert("Register", "This email is already in use");       
      }

      console.log(error);
      Alert.alert("Register", "It was not possible to create the account");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h="$full"
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="two trucks"
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$20">
            <Text color="$white" fontSize="$6xl">
              Billor
            </Text>

            <Text color="$gray300" fontSize="$md">
              Make it come true
            </Text>
          </Center>

          <Center gap="$2" flex={1}>
            <Heading color="$gray100" marginBottom="$2">
              Create an account
            </Heading>

            <Input placeholder="Name" value={name} onChangeText={setName} />

            <Input
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title="Create and Log In"
              variant="solid"
              isLoading={isLoading}
              onPress={handleSignUp}
            />
          </Center>

          <Button
            title="Return to login"
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
