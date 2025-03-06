import { app, auth } from "@/config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);

// REGISTRAR USUARIO
export const registerUser = async (
  email: string,
  password: string,
  name: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Guardar usuario en Firestore con su rol
    await setDoc(doc(db, "usuarios", user.uid), {
      name,
      email,
      role: "user",
      createdAt: new Date(),
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// INICIAR SESIÓN
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// CERRAR SESIÓN
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
