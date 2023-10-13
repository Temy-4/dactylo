import admin from "firebase-admin";
import serviceAccount from "../../../serviceAccountKey.json";
import { log } from "../helper";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dactylo-5e25f-default-rtdb.firebaseio.com",
    });
  } catch (error) {
    log("Firebase admin initialization error", error.stack);
  }
}
export { admin };
export default admin.firestore();

export const verifyIdToken = async (token) => {
  if (!token) return null;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.clear();
    log({ decodedToken });
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
};
