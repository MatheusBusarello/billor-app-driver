import { auth, storage } from "../../../config/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function updateUserProfile(name: string, photoURL: string | null) {
  if (!auth.currentUser) throw new Error("User not authenticated");

  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL || auth.currentUser.photoURL,
  });
}

export async function updateUserPassword(oldPassword: string, newPassword: string) {
  if (!auth.currentUser?.email) throw new Error("User email not found");

  const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
}

export async function uploadUserProfilePhoto(uri: string): Promise<string> {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const response = await fetch(uri);
  const blob = await response.blob();
  const fileRef = ref(storage, `profile_pictures/${auth.currentUser.uid}.jpg`);
  await uploadBytes(fileRef, blob);
  
  return await getDownloadURL(fileRef);
}
