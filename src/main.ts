import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeApp } from "firebase/app";
import { WsAdapter } from '@nestjs/platform-ws';

import { io } from 'socket.io-client';
const socket = io('http://localhost:3003')
const initialFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDHn1k4esZxLsGBz3OIyGT6HBXWVpw9f44",
    authDomain: "wfms-8a473.firebaseapp.com",
    projectId: "wfms-8a473",
    storageBucket: "wfms-8a473.appspot.com",
    messagingSenderId: "170837701111",
    appId: "1:170837701111:web:2bd642c63211d51cb37ef2",
    measurementId: "G-4W9ZL0HFDV"
  };
  initializeApp(firebaseConfig);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.enableCors({});
  // app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(process.env.PORT,'0.0.0.0');//3003
  console.log(`Application is running on: ${await app.getUrl()}`);
}
// initialFirebase();
bootstrap();
