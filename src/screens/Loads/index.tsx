import { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput, ScrollView, Alert } from "react-native";
import { 
  useForegroundPermissions, 
  watchPositionAsync, 
  LocationAccuracy, 
  LocationSubscription, 
  LocationObjectCoords, 
  requestBackgroundPermissionsAsync 
} from "expo-location";

import { Container, Content, Message } from "./styles";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { LoadIdentifyInput } from "../../components/LoadIdentifyInput";
import { TextAreaInput } from "../../components/TextAreaInput";
import { Loading } from "../../components/Loading";
import { LocationInfo } from "../../components/LocationInfo";
import { Truck } from "phosphor-react-native";
import { Map } from "../../components/Map";

import { loadIdentifyValidate } from "../../utils/loadIdentifyValidate";
import { getAddressLocation } from "../../utils/getAddressLocation";

import { useNavigation } from "@react-navigation/native";
import { createHistoric } from "../../libs/firebase/services/historicService";
import { addCoordsToHistoric } from "../../libs/firebase/services/coordsService";
import { auth, db } from "../../config/firebase";

import { getDoc, doc } from "firebase/firestore";

export function Loads() {
  const [description, setDescription] = useState("");
  const [loadIdentify, setLoadIdentify] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null);

  const [locationForegroundPermissions, requestLocationForegroundPermissions] = useForegroundPermissions();

  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const loadIdentifyRef = useRef<TextInput>(null);

  async function handleDepartureRegister() {
    try {
      if (!loadIdentifyValidate(loadIdentify)) {
        loadIdentifyRef.current?.focus();
        return Alert.alert("Invalid code", "The code is incorrect");
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert("Please, add an information");
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert("Localization!", "Failed to get current location");
      }

      setIsRegistering(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();
      if (!backgroundPermissions.granted) {
        setIsRegistering(false);
        return Alert.alert("Localization", "The app needs permission to access location in the background.");
      }

      const user = auth.currentUser;
      if (!user) {
        setIsRegistering(false);
        return Alert.alert("Error", "User not authenticated.");
      }

      const historicId = await createHistoric({
        user_id: user.uid,
        load_identify: loadIdentify.toUpperCase(),
        description,
        status: "departure",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const historicRef = doc(db, "historics", historicId);
      await getDoc(historicRef);

      await addCoordsToHistoric(historicId, {
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        timestamp: new Date().getTime(),
      });

      Alert.alert("Departure", "Departure successfully registered!");
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to log the departure");
    } finally {
      setIsRegistering(false);
    }
  }

  useEffect(() => {
    requestLocationForegroundPermissions();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermissions?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000
      },
      async (location) => {
        setCurrentCoords(location.coords);

        const address = await getAddressLocation(location.coords);
        if (address) {
          setCurrentAddress(address);
        }

        setIsLoadingLocation(false);
      }
    ).then((response) => (subscription = response));

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermissions]);

  if (!locationForegroundPermissions?.granted) {
    return (
      <Container>
        <Header title="Departure" />
        <Message>You need to allow the app to access your location. Please go to settings</Message>
      </Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title="Departure" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}

          <Content>
            {currentAddress && (
              <LocationInfo icon={Truck} label="Current Address" description={currentAddress} />
            )}

            <LoadIdentifyInput
              ref={loadIdentifyRef}
              label="Billor Load ID"
              placeholder="BA0001"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLoadIdentify}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Additional Information"
              placeholder="details"
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button title="Departure Register" onPress={handleDepartureRegister} isLoading={isRegistering} />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
