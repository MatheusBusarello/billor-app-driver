import { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Center, Heading, Text, VStack } from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';

import { Header } from '../../components/Header';
import { UserPhoto } from '../../components/UserPhoto';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { auth } from '../../config/firebase';
import { updateUserProfile, updateUserPassword, uploadUserProfilePhoto } from '../../libs/firebase/services/userServices';

export function Profile() {
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdateProfile() {
    try {
      setIsLoading(true);

      if (photo !== user?.photoURL) {
        await updateUserProfile(name, photo);
      }

      if (name !== user?.displayName) {
        await updateUserProfile(name, photo);
      }

      if (oldPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          return Alert.alert("Error", "Passwords do not match.");
        }
        await updateUserPassword(oldPassword, newPassword);
      }

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setIsLoading(true);
        const photoURL = await uploadUserProfilePhoto(result.assets[0].uri);
        setPhoto(photoURL);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to upload photo.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <VStack flex={1}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto source={{ uri: photo || "https://via.placeholder.com/150" }} alt="User photo" size="xl" />

          <TouchableOpacity onPress={handleSelectPhoto}>
            <Text color="$blue500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">
              Change photo
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input value={name} onChangeText={setName} placeholder="Name" />
            <Input value={user?.email || ''} isReadOnly />
          </Center>

          <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize="$md" mt="$12" mb="$2">
            Change password (optional)
          </Heading>

          <Center w="$full" gap="$4">
            <Input value={oldPassword} onChangeText={setOldPassword} placeholder="Old password" secureTextEntry />
            <Input value={newPassword} onChangeText={setNewPassword} placeholder="New password" secureTextEntry />
            <Input value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm new password" secureTextEntry />
          </Center>

          <Button title="Update Profile" onPress={handleUpdateProfile} isLoading={isLoading} mt="$8" />
        </Center>
      </ScrollView>
    </VStack>
  );
}
