import { db } from "../../../config/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc
} from "firebase/firestore";

export type HistoricProps = {
  load_identify: string;
  description: string;
  status: "departure" | "delivery";
  created_at?: Date;
  updated_at?: Date;
};

export async function createHistoric(data: Omit<HistoricProps, 'created_at' | 'updated_at'>) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated.");

    const docRef = await addDoc(collection(db, "historics"), {
      ...data,
      user_id: user.uid,
      created_at: new Date(),
      updated_at: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding historic: ", error);
    throw error;
  }
}

export async function updateHistoricStatus(historicId: string, status: "departure" | "delivery") {
  try {
    const docRef = doc(db, "historics", historicId);
    await updateDoc(docRef, {
      status,
      updated_at: new Date()
    });
  } catch (error) {
    console.error("Error updating historic: ", error);
    throw error;
  }
}

export async function getUserHistorics() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User not authenticated.");

    const q = query(
      collection(db, "historics"),
      where("user_id", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching historics: ", error);
    throw error;
  }
}
