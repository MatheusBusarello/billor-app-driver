import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert, FlatList } from "react-native";
import dayjs from "dayjs";
import { onSnapshot, query, collection, where, orderBy } from "firebase/firestore";
import { db, auth } from "../../config/firebase";

import { HomeHeader } from "../../components/HomeHeader";
import { LoadStatus } from "../../components/LoadStatus";
import { Container, Content, Label, Title } from "./styles";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";

export function Home() {
  const [loadInUse, setLoadInUse] = useState<HistoricCardProps | null>(null);
  const [loadHistoric, setLoadHistoric] = useState<HistoricCardProps[]>([]);

  const { navigate } = useNavigation();

  function handleHistoricDetails(id: string) {
    navigate("delivery", { id });
  }

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const departureQuery = query(
      collection(db, "historics"),
      where("status", "==", "departure"),
      where("user_id", "==", user.uid)
    );

    const deliveryQuery = query(
      collection(db, "historics"),
      where("status", "==", "delivery"),
      where("user_id", "==", user.uid),
      orderBy("created_at", "desc")
    );

    const unsubscribeDeparture = onSnapshot(departureQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setLoadInUse({
          id: doc.id,
          loadIdentify: doc.data().load_identify,
          isSync: true,
          created: dayjs(doc.data().created_at.toDate()).format('[Departure] MM/DD/YYYY [at] hh:mm a'),
        });
      } else {
        setLoadInUse(null);
      }
    });

    const unsubscribeDelivery = onSnapshot(deliveryQuery, (snapshot) => {
      const formattedHistoric = snapshot.docs.map(doc => ({
        id: doc.id,
        loadIdentify: doc.data().load_identify,
        isSync: true,
        created: dayjs(doc.data().created_at.toDate()).format('[Departure] MM/DD/YYYY [at] hh:mm a'),
      }));

      setLoadHistoric(formattedHistoric);
    });

    return () => {
      unsubscribeDeparture();
      unsubscribeDelivery();
    };
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <LoadStatus 
          loadIdentify={loadInUse?.loadIdentify}
          onPress={() => {
            loadInUse ? navigate("delivery", { id: loadInUse.id }) : navigate("loads");
          }}
        />

        <Title>History</Title>

        <FlatList 
          data={loadHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard 
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>No load registered</Label>}
        />
      </Content>
    </Container>
  );
}
