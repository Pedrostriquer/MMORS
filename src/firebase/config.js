import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração obtida do seu console
const firebaseConfig = {
  apiKey: "AIzaSyA6javjgP1pREang0Hdhteuq9i5gPh7Pqg",
  authDomain: "mmors-366c0.firebaseapp.com",
  projectId: "mmors-366c0",
  storageBucket: "mmors-366c0.firebasestorage.app",
  messagingSenderId: "535661624338",
  appId: "1:535661624338:web:2acf39507bad914b27eccb",
  measurementId: "G-0DY03JRGDG"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias dos serviços que vamos usar
export const auth = getAuth(app);      // Para o Login do Admin
export const db = getFirestore(app);    // Para os Produtos, Categorias e Filtros
export const storage = getStorage(app); // Para as Fotos e Vídeos das joias