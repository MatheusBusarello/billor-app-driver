import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { Timestamp } from "firebase/firestore";

const chatCollection = collection(db, "chats");

export async function sendMessage(message: string) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(chatCollection, {
      text: message,
      createdAt: Timestamp.now(),
      user: {
        _id: user.uid,
        name: user.displayName || "Anonymous",
        avatar: user.photoURL || "https://i.pravatar.cc/300",
      },
      user_id: user.uid,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

export function subscribeToChat(setMessages: (messages: any) => void) {
  const user = auth.currentUser;
  if (!user) return () => {};

  const q = query(
    chatCollection,
    where("user_id", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data?.user || !data?.text || !data?.createdAt) return null;

        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
        };
      })
      .filter(Boolean);

    setMessages(messages);
  });
}
