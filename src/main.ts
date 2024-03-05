import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDHn1k4esZxLsGBz3OIyGT6HBXWVpw9f44",
  authDomain: "wfms-8a473.firebaseapp.com",
  projectId: "wfms-8a473",
  storageBucket: "wfms-8a473.appspot.com",
  messagingSenderId: "170837701111",
  appId: "1:170837701111:web:2bd642c63211d51cb37ef2",
  measurementId: "G-4W9ZL0HFDV"
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(3000);
  initializeApp(firebaseConfig);
}
bootstrap();
