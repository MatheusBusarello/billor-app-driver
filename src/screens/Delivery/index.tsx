import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, ScrollView } from "react-native";
import { LatLng } from "react-native-maps";
import { doc, getDoc, deleteDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../../config/firebase";
import { stopLocationTask } from "../../tasks/backgroundLocation";

import { Container, Content, Description, Footer, Label, LoadIdentify, AsyncMessage } from "./styles";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { X } from "phosphor-react-native";
import { Map } from "../../components/Map";
import { Locations } from "../../components/Locations";
import { getAddressLocation } from "../../utils/getAddressLocation";
import { LocationInfoProps } from "../../components/LocationInfo";
import dayjs from "dayjs";
import { DeliveryDoc } from "../../components/DeliveryDoc";

type RouteParamsProps = {
  id: string;
};

export function Delivery() {
  const [historic, setHistoric] = useState<any>(null);
  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>({} as LocationInfoProps);
  const [delivery, setDelivery] = useState<LocationInfoProps | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const route = useRoute();
  const { id } = route.params as RouteParamsProps;
  const { goBack } = useNavigation();

  const title = historic?.status === "departure" ? "Delivery" : "Details";

  async function fetchHistoricData() {
    try {
      const historicRef = doc(db, "historics", id);
      const historicSnap = await getDoc(historicRef);

      if (!historicSnap.exists()) {
        Alert.alert("Error", "Historic not found");
        return;
      }

      const historicData = { id: historicSnap.id, ...historicSnap.data() };
      setHistoric(historicData);

      const coordsRef = collection(db, "historics", id, "coords");
      const coordsSnap = await getDocs(coordsRef);
      const coordsData = coordsSnap.docs.map((doc) => doc.data() as LatLng);

      setCoordinates(coordsData);

      if (coordsData.length > 0) {
        const departureStreet = await getAddressLocation(coordsData[0]);
        setDeparture({
          label: `Street departure: ${departureStreet ?? ""}`,
          description: dayjs(new Date(coordsData[0].timestamp)).format("MM/DD/YYYY [at] hh:mm a"),
        });

        if (historicData.status === "delivery") {
          const lastLocation = coordsData[coordsData.length - 1];
          const deliveryStreet = await getAddressLocation(lastLocation);

          setDelivery({
            label: `Street delivery: ${deliveryStreet ?? ""}`,
            description: dayjs(new Date(lastLocation.timestamp)).format("MM/DD/YYYY [at] hh:mm a"),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching historic:", error);
      Alert.alert("Error", "Failed to fetch delivery data");
    }
  }

  async function handleRemoveLoadUsage() {
    Alert.alert("Cancel", "Do you want to cancel the load registration?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: async () => await removeLoadUsage() },
    ]);
  }

  async function removeLoadUsage() {
    try {
      await deleteDoc(doc(db, "historics", id));
      await stopLocationTask();
      goBack();
    } catch (error) {
      console.error("Error deleting historic:", error);
      Alert.alert("Error", "Failed to remove load usage");
    }
  }

  async function handleDeliveryRegister() {
    try {
      if (!historic) {
        return Alert.alert("Error", "Failed to fetch delivery data");
      }

      let imageUrl = "";

      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const filename = `${id}-${new Date().getTime()}.jpg`;
        const imageRef = ref(storage, `deliveryImages/${filename}`);

        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "historics", id), {
        status: "delivery",
        updated_at: new Date(),
        image_url: imageUrl,
      });

      await stopLocationTask();

      Alert.alert("Delivery", "Delivery successfully registered!");
      goBack();
    } catch (error) {
      console.error("Error updating delivery:", error);
      Alert.alert("Error", "Failed to register the delivery");
    }
  }

  useEffect(() => {
    fetchHistoricData();
  }, []);

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <ScrollView>
        <Content>
          <Locations departure={departure} delivery={delivery} />

          <Label>Load Identification</Label>
          <LoadIdentify>{historic?.load_identify}</LoadIdentify>

          <Label>Details</Label>
          <Description>{historic?.description}</Description>

          <DeliveryDoc
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            status={historic?.status}
            imageUrl={historic?.image_url}
          />
        </Content>
      </ScrollView>

      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveLoadUsage} />
          <Button title="Confirm delivery" width={250} onPress={handleDeliveryRegister} />
        </Footer>
      )}

      {dataNotSynced && <AsyncMessage>{historic?.status === "departure" ? "Departure" : "Delivery"} Synchronization pending</AsyncMessage>}
    </Container>
  );
}
