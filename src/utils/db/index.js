import admin from "firebase-admin";
import { log } from "../helper";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN,
      }),
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
