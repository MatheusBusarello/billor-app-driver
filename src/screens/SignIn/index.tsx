import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Image, Center, Text, Heading, ScrollView } from '@gluestack-ui/themed';

import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithCredential } from "firebase/auth";

import { useNavigation } from '@react-navigation/native';

import { AuthNavigationRoutesProps } from '../../routes/auth.routes';

import BackgroundImg from '../../assets/backgroundImg.png';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function SignIn() {
  const navigation = useNavigation<AuthNavigationRoutesProps>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function handleEmailSignIn() {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe email e senha');
    }

    try {
      setIsAuthenticating(true);

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log(error);
      setIsAuthenticating(false);
      
      if (error.code === 'auth/invalid-credential') {
        return Alert.alert('Login', 'Invalid credentials.');
      }

      return Alert.alert('Login', 'Unable to sign in.');
    }
  }
  
  function handleNavigate() {
    navigation.navigate("signUp");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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

          <Center gap="$2">
            <Heading color="$gray100" marginBottom="$2">
              Welcome!
            </Heading>

            <Input 
              placeholder="Email" 
              keyboardType='email-address' 
              autoCapitalize='none'
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
              title="Sign In" 
              variant="solid" 
              onPress={handleEmailSignIn}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Need an account?
            </Text>

            <Button title="Register" variant="outline" onPress={handleNavigate}/>
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}