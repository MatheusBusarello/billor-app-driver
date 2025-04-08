BillorApp Driver
Aplicativo mobile desenvolvido em React Native com Firebase, focado no gerenciamento de cargas, envio de comprovantes e comunicação com suporte em tempo real.

📱 Funcionalidades
Autenticação por e-mail e senha (Firebase Auth)

Tela inicial com:

Registro de saída e chegada de cargas

Histórico de entregas com imagens

Envio de imagens (galeria ou câmera)

Chat em tempo real com o suporte

Perfil com edição de nome, senha e foto

Notificações Push (Firebase Cloud Messaging)

🚀 Como executar o projeto
1. Clone o repositório
bash
Copy
Edit
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
2. Instale as dependências
nginx
Copy
Edit
npm install
3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com a seguinte variável:

ini
Copy
Edit
GOOGLE_MAPS_API_KEY=SUA_CHAVE
Você pode obter essa chave criando um projeto no Google Cloud Console.

4. Configure o Firebase
O arquivo src/config/firebase.ts está ignorado no repositório por segurança. Para configurá-lo:

Renomeie o arquivo firebase.example.ts para firebase.ts

Adicione suas credenciais do Firebase no arquivo renomeado

📲 Executar o app
Este projeto utiliza expo-dev-client para acessar recursos nativos como câmera e notificações push.

Android
arduino
Copy
Edit
npx expo run:android
iOS
arduino
Copy
Edit
npx expo run:ios
🔔 Notificações Push
O app utiliza Firebase Cloud Messaging (FCM) com suporte a:

App em primeiro plano (com exibição de alerta)

App em segundo plano

App fechado

O token FCM é gerado automaticamente após o login e pode ser usado para testes via Firebase Console ou API do FCM.

🧭 Fluxo do app
Crie uma nova conta com e-mail e senha

Registre entregas com saída e chegada

Envie uma imagem (foto ou galeria)

Acesse o histórico com visualização das imagens

Converse com o suporte via chat

Edite seu perfil (nome, senha e foto)

Teste notificações push com o token gerado

🛠️ Tecnologias utilizadas
React Native com Expo (eject com expo-dev-client)

Firebase (Authentication, Firestore, Storage, Messaging)

TypeScript

Styled Components

Gluestack UI

React Navigation
