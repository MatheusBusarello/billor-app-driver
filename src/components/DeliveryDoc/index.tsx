import { Platform, View, Alert, ActionSheetIOS, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../Button";

type Props = {
  selectedImage: string | null;
  setSelectedImage: (uri: string | null) => void;
  status?: string;
  imageUrl?: string;
};

export function DeliveryDoc({
  selectedImage,
  setSelectedImage,
  status,
  imageUrl,
}: Props) {
  function showImagePickerOptions() {
    const options = ["Take a Photo", "Choose from Gallery", "Cancel"];
    const cancelButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await handleTakePhoto();
          } else if (buttonIndex === 1) {
            await handlePickImage();
          }
        }
      );
    } else {
      Alert.alert("Upload Image", "Choose an option", [
        { text: "Take a Photo", onPress: handleTakePhoto },
        { text: "Choose from Gallery", onPress: handlePickImage },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  const displayImage = selectedImage || imageUrl;

  if (status === "delivery") {
    return (
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {displayImage ? (
          <Image
            source={{ uri: displayImage }}
            style={{ width: 200, height: 200, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ color: "#fff", marginTop: 8 }}>
            No image provided for this delivery.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <Button
        title={selectedImage ? "Change Image" : "Upload Image"}
        onPress={showImagePickerOptions}
      />

      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 200, height: 200, marginTop: 10, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
