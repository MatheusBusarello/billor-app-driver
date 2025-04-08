import { db } from "../../../config/firebase";

import { collection, addDoc } from "firebase/firestore";
export type CoordsProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export async function addCoordsToHistoric(historicId: string, coords: CoordsProps) {
  try {
    const docRef = await addDoc(collection(db, "historics", historicId, "coords"), coords);
    return docRef.id;
  } catch (error) {
    console.error("Error adding coords: ", error);
    throw error;
  }
}