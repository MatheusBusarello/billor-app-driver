# BillorApp Driver

A mobile application developed in **React Native with Firebase**, focused on load management, proof submission, and real-time support communication.

---

## Features

- Email and password authentication (Firebase Auth)
- Home screen with:
  - Load departure and arrival registration 
  - Delivery history with images  
- Image upload (from gallery or camera)  
- Real-time chat with support
- Profile with name, password, and photo editing
- Notificações Push (Firebase Cloud Messaging)

---

## How to Run the Project

### 1. Clone the repository

```git clone https://github.com/seu-usuario/seu-repositorio.git cd your-repository```

### 2. Install dependencies

```npm install```

### 3. Set environment variables

Create a `.env` file at the root of the project with the following variable:

```GOOGLE_MAPS_API_KEY=YOUR_KEY```

You can obtain this key by creating a project on the [Google Cloud Console](https://console.cloud.google.com/).

### 4. Configure Firebase

The `src/config/firebase.ts` file is ignored in the repository for security reasons. To configure it:

- Rename the `firebase.example.ts` file to `firebase.ts`
- Add your Firebase credentials to the renamed file.

---

## Run the app

This project uses `expo-dev-client` to access native features like the camera and push notifications.

### Android

```npx expo run:android```

### iOS

```npx expo run:ios```

---

## Notificações Push

The app uses **Firebase Cloud Messaging (FCM)** with support for:

- Foreground (with alert display))  
- Background
- Closed app  

The FCM token is automatically generated after login and can be used for testing via Firebase Console or FCM API.

---

## Fluxo do app

1. Create a new account with email and password
2. Register deliveries with departure and arrival  
3. Upload an image (photo or from gallery)
4. Access the delivery history with image previews 
5. Chat with support in real-time
6. Edit your profile (name, password, and photo) 
7. Test push notifications using the generated token

---

## Tecnologias utilizadas

- React Native com Expo (eject com expo-dev-client)  
- Firebase (Authentication, Firestore, Storage, Messaging)  
- TypeScript  
- Styled Components  
- Gluestack UI  
- React Navigation
