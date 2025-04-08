# BillorApp Driver

Aplicativo mobile desenvolvido em **React Native com Firebase**, focado no gerenciamento de cargas, envio de comprovantes e comunicação com suporte em tempo real.

---

## Funcionalidades

- Autenticação por e-mail e senha (Firebase Auth)
- Tela inicial com:
  - Registro de saída e chegada de cargas
  - Histórico de entregas
- Envio de imagem (galeria ou câmera)
- Chat em tempo real com suporte
- Perfil com alteração de nome, senha e foto
- Notificações Push (Firebase Cloud Messaging)

---

## Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

### 2. Instale as dependências

npm install

### 3. Crie um arquivo .env na raiz com a chave do Google

GOOGLE_MAPS_API_KEY=SUA_CHAVE

Para você conseguir sua chave é necessário criar no google cloud

### 4. Configuração do Firebase

O arquivo src/config/firebase.ts está ignorado no repositório por segurança. Crie-o manualmente renomeando o firebase.example para firebase.ts e acrescendo suas credenciais.

## Executar o app

Este projeto utiliza expo-dev-client para acessar recursos nativos como câmera e notificações.

### Android

npx expo run:android

### iOS

npx expo run:ios

## Notificações Push

O app utiliza Firebase Cloud Messaging (FCM) com suporte para:

- App em primeiro plano (mensagem com alerta)

- App em segundo plano

- App fechado

O token FCM é gerado automaticamente após o login e pode ser usado para testes com o Firebase Console ou API do FCM.

## Fluxo do projeto

Crie uma nova conta com e-mail e senha

Realize o registro de entregas

Envie uma imagem da entrega (foto ou galeria)

Acesse o histórico com as imagens

Converse com o suporte via chat

Edite seu perfil

Teste notificações push com token gerado

## Tecnologias 

React Native com Expo (eject com expo-dev-client)

Firebase (Auth, Firestore, Storage, Messaging)

TypeScript

Styled Components

Gluestack UI

React Navigation